from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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

    def get_permissions(self):
        """Ouvre la porte uniquement pour la création publique (POST React)."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Reçoit le JSON plat de React, extrait le client, valide le meuble
        via le DevisCreationSerializer existant et assemble le tout.
        """
        donnees_react = request.data
        
        nom_client = donnees_react.get('nom', '').strip()
        telephone  = donnees_react.get('telephone_whatsapp', '').strip()
        email_client = donnees_react.get('email', '').strip()

        if not nom_client or not telephone:
            return Response(
                {"error": "Le nom et le numéro WhatsApp sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # 1. Récupération ou création du profil client dans la BD
                client, created = Client_Prospect.objects.get_or_create(
                    telephone_whatsapp=telephone,
                    defaults={'nom': nom_client, 'email': email_client}
                )

                # 2. On isole les données destinées uniquement aux specs du meuble
                devis_data = {
                    'type_meuble': donnees_react.get('type_meuble'),
                    'dimensions_approximatives': donnees_react.get('dimensions_approximatives', ''),
                    'materiau': donnees_react.get('materiau', '')
                }

                # 3. Utilisation du DevisCreationSerializer
                serializer = DevisCreationSerializer(data=devis_data)
                
                # MODIFICATION ICI : On attrape l'erreur de validation si elle existe
                if not serializer.is_valid():
                    print(f"❌ DÉFAUT DE VALIDATION SERIALIZER : {serializer.errors}")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                # 4. On enregistre en y injectant notre client à la volée
                devis_instance = serializer.save(client=client)

                # 5. Fabrication du texte de relance WhatsApp
                devis_instance.message_whatsapp_genere = (
                    f"Devis Pro #{client.nom} : {devis_instance.type_meuble}\n\n"
                    f"Bonjour {client.nom},\n"
                    f"J'ai bien reçu votre demande pour votre projet de \"{devis_instance.type_meuble}\" "
                    f"({devis_instance.dimensions_approximatives}) en {devis_instance.materiau or 'bois'}.\n\n"
                    f"Je prépare l'estimation budgétaire et je reviens vers vous rapidement.\n"
                    f"Cordialement."
                )
                devis_instance.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"❌ ERREUR API DEVIS : {str(e)}")
            return Response(
                {"error": "Une erreur technique interne est survenue."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )