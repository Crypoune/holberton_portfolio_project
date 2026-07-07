import re
from datetime import timedelta
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.db import transaction
from apps.menuisier.models import Chantier, Temoignage, Devis, Client_Prospect
# On importe TOUS les outils existants proprement ici dès le départ :
from .serializers import (
    ChantierSerializer, 
    TemoignageSerializer, 
    DevisSerializer, 
    DevisCreationSerializer
)

class ChantierViewSet(viewsets.ModelViewSet):
    queryset            = Chantier.objects.filter(est_termine=True)
    serializer_class    = ChantierSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field        = 'slug'


class TemoignageViewSet(viewsets.ModelViewSet):
    queryset            = Temoignage.objects.filter(est_valide=True)
    serializer_class    = TemoignageSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]


# ==============================================================================
# DEVIS VIEWSET OPTIMISÉ POUR L'INTÉGRATION REACT
# ==============================================================================
class DevisViewSet(viewsets.ModelViewSet):
    queryset            = Devis.objects.all()
    serializer_class    = DevisSerializer
    permission_classes  = [permissions.IsAuthenticated]
    parser_classes      = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        """Ouvre la porte uniquement pour la création publique (POST React)."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Reçoit le JSON ou FormData de React, valide les données (coordonnées, dimensions, options),
        applique une limitation de débit (anti-spam IP/téléphone) et enregistre.
        """
        donnees_react = request.data
        
        nom_client = donnees_react.get('nom', '').strip()
        telephone  = donnees_react.get('telephone_whatsapp', '').strip()
        email_client = donnees_react.get('email', '').strip()
        code_postal = donnees_react.get('code_postal', '').strip()
        ville = donnees_react.get('ville', '').strip()

        # 1. Vérification des champs obligatoires
        if not nom_client or not telephone:
            return Response(
                {"error": "Le nom et le numéro WhatsApp sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not code_postal or not ville:
            return Response(
                {"error": "Le code postal et la ville sont indispensables."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Validation du nom
        if not re.match(r'^[a-zA-ZÀ-ÿ\s\-\']{3,100}$', nom_client):
            return Response(
                {"error": "Le nom doit comporter entre 3 et 100 caractères et ne contenir que des lettres."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Validation de l'email
        if email_client:
            try:
                validate_email(email_client)
            except ValidationError:
                return Response(
                    {"error": "Le format de l'adresse e-mail est invalide."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 4. Validation et normalisation du téléphone
        tel_clean = telephone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not tel_clean.startswith('+'):
            return Response(
                {"error": "Le numéro doit commencer par '+' suivi du code pays (ex: +261 pour Madagascar ou +33 pour la France)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if tel_clean.startswith('+261'):  # Madagascar
            local = tel_clean[4:]
            if not re.match(r'^3[23489]\d{7}$', local):
                return Response(
                    {"error": "Pour Madagascar, le numéro après +261 doit comporter exactement 9 chiffres et commencer par 32, 33, 34, 38 ou 39."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif tel_clean.startswith('+33'):  # France
            local = tel_clean[3:]
            if not re.match(r'^[1-9]\d{8}$', local):
                return Response(
                    {"error": "Pour la France, le numéro après +33 doit comporter exactement 9 chiffres (sans le 0 initial)."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif tel_clean.startswith('+262'):  # Réunion / Mayotte
            local = tel_clean[4:]
            if not re.match(r'^[1-9]\d{8}$', local):
                return Response(
                    {"error": "Pour la Réunion ou Mayotte, le numéro après +262 doit comporter exactement 9 chiffres."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Autre pays
            if not re.match(r'^\+[1-9]\d{7,14}$', tel_clean):
                return Response(
                    {"error": "Le numéro de téléphone international est invalide."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 5. Récupération de l'IP du client
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        # 6. Anti-Spam / Rate Limiting (max 3 requêtes en 15 minutes)
        cooldown_time = timezone.now() - timedelta(minutes=15)
        
        recent_by_ip = Devis.objects.filter(ip_address=ip, date_creation__gte=cooldown_time).count()
        if recent_by_ip >= 3:
            return Response(
                {"error": "Limite de demandes atteinte pour cette adresse IP. Veuillez patienter 15 minutes."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        recent_by_phone = Devis.objects.filter(client__telephone_whatsapp=tel_clean, date_creation__gte=cooldown_time).count()
        if recent_by_phone >= 3:
            return Response(
                {"error": "Limite de demandes atteinte pour ce numéro de téléphone. Veuillez patienter 15 minutes."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        try:
            with transaction.atomic():
                # 7. Récupération ou création du profil client
                client, created = Client_Prospect.objects.get_or_create(
                    telephone_whatsapp=tel_clean,
                    defaults={'nom': nom_client, 'email': email_client}
                )
                if not created and email_client and not client.email:
                    # Optionnel : Mettre à jour l'email s'il n'était pas défini
                    client.email = email_client
                    client.save()

                # 8. Récupération des données du devis
                devis_data = {
                    'type_meuble': donnees_react.get('type_meuble'),
                    'dimensions_approximatives': donnees_react.get('dimensions_approximatives', ''),
                    'materiau': donnees_react.get('materiau', ''),
                    'code_postal': code_postal,
                    'ville': ville,
                    'type_client': donnees_react.get('type_client', ''),
                    'type_travaux': donnees_react.get('type_travaux', ''),
                    'type_produit': donnees_react.get('type_produit', ''),
                    'quantite': int(donnees_react.get('quantite') or 1),
                    'budget': donnees_react.get('budget', ''),
                    'delai': donnees_react.get('delai', ''),
                    'description': donnees_react.get('description', ''),
                    'photo_plan': request.FILES.get('photo_plan') or donnees_react.get('photo_plan')
                }

                # 9. Utilisation du DevisCreationSerializer
                serializer = DevisCreationSerializer(data=devis_data)
                if not serializer.is_valid():
                    print(f"❌ DÉFAUT DE VALIDATION SERIALIZER : {serializer.errors}")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                # 10. Enregistrement avec client et IP
                devis_instance = serializer.save(client=client, ip_address=ip)

                # 11. Fabrication du texte de relance WhatsApp
                product_label = devis_instance.type_meuble or devis_instance.type_produit or "Menuiserie"
                devis_instance.message_whatsapp_genere = (
                    f"Devis Pro #{client.nom} : {product_label}\n\n"
                    f"Bonjour {client.nom},\n"
                    f"J'ai bien reçu votre demande de devis pour un projet de \"{product_label}\" ({devis_instance.type_client or 'Particulier'}) :\n"
                    f"- Travaux : {devis_instance.type_travaux or 'Non précisé'}\n"
                    f"- Produit : {devis_instance.type_produit or 'Non précisé'}\n"
                    f"- Quantité : {devis_instance.quantite or 1}\n"
                    f"- Dimensions : {devis_instance.dimensions_approximatives or 'non précisées'}\n"
                    f"- Matériau : {devis_instance.materiau or 'non précisé'}\n"
                    f"- Localisation : {devis_instance.code_postal} {devis_instance.ville}\n"
                    f"- Délai : {devis_instance.delai or 'Non précisé'}\n"
                    f"- Budget : {devis_instance.budget or 'non précisé'}\n"
                    f"- Description : {devis_instance.description or 'aucune'}\n\n"
                    f"Je prépare l'estimation budgétaire et je reviens vers vous rapidement.\n"
                    f"Cordialement."
                )
                devis_instance.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"❌ ERREUR API DEVIS : {str(e)}")
            return Response(
                {"error": f"Une erreur technique interne est survenue : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )