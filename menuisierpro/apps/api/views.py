from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import transaction
from apps.menuisier.models import Chantier, Temoignage, Devis, Client_Prospect
from .serializers import TemoignagePublicSerializer
from .serializers import ClientProspectSerializer
import logging
from .serializers import (
    ChantierSerializer, ChantierListSerializer,
    TemoignagePublicSerializer, 
    DevisSerializer, 
    DevisCreationSerializer
)
from .permissions import IsArtisanStaff, IsArtisanStaffOrReadOnly

logger = logging.getLogger(__name__)

class ChantierViewSet(viewsets.ModelViewSet):
    queryset           = Chantier.objects.filter(est_termine=True).prefetch_related('images')
    serializer_class    = ChantierSerializer
    permission_classes  = [IsArtisanStaffOrReadOnly]
    lookup_field        = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return ChantierListSerializer
        return ChantierSerializer

class TemoignageViewSet(viewsets.ReadOnlyModelViewSet):
    # Lecture seule : la soumission passe exclusivement par le flux à token
    # (apps/menuisier/views.py), jamais par cette API.
    queryset           = Temoignage.objects.filter(est_valide=True)
    serializer_class   = TemoignagePublicSerializer
    permission_classes = [permissions.AllowAny]

class DashboardStatsView(APIView):
    """
    Métriques du tableau de bord, calculées entièrement côté base de données.
    - Un seul aggregate() = une seule requête SQL avec plusieurs COUNT(...) FILTER(...),
      donc pas de N+1 et pas de chargement de la table Devis en mémoire.
    - .only() + slicing sur les dernières inscriptions : on ne récupère que les
      colonnes utiles, et seulement 5 lignes, quelle que soit la taille de la table.
    """
    permission_classes = [IsArtisanStaff]

    def get(self, request):
        devis_stats = Devis.objects.aggregate(
            total=Count('id'),
            en_attente=Count('id', filter=Q(statut=Devis.Statut.EN_ATTENTE)),
            a_relancer=Count('id', filter=Q(statut__in=[
                Devis.Statut.RELANCE_J3, Devis.Statut.RELANCE_J7,
            ])),
            acceptes=Count('id', filter=Q(statut=Devis.Statut.CONVERTI)),
        )

        dernieres_inscriptions = (
            Client_Prospect.objects
            .only('id', 'nom', 'telephone_whatsapp', 'date_creation')
            .order_by('-date_creation')[:5]
        )

        return Response({
            "devis": devis_stats,
            "total_clients": Client_Prospect.objects.count(),  # COUNT(*) pur, pas de SELECT *
            "dernieres_inscriptions": ClientProspectSerializer(
                dernieres_inscriptions, many=True
            ).data,
        })
# ==============================================================================
# DEVIS VIEWSET OPTIMISÉ POUR L'INTÉGRATION REACT
# ==============================================================================
class DevisViewSet(viewsets.ModelViewSet):
    queryset            = Devis.objects.all()
    serializer_class    = DevisSerializer
    permission_classes  = [IsArtisanStaff]

    def get_permissions(self):
        """Seule la création (formulaire public React) reste ouverte à tous.."""
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

                client, created = Client_Prospect.objects.get_or_create(
                    telephone_whatsapp=telephone,
                    defaults={'nom': nom_client, 'email': email_client}
                )

                devis_data = {
                    'type_meuble': donnees_react.get('type_meuble'),
                    'dimensions_approximatives': donnees_react.get('dimensions_approximatives', ''),
                    'materiau': donnees_react.get('materiau', '')
                }

                serializer = DevisCreationSerializer(data=devis_data)
                
                if not serializer.is_valid():
                    logger.warning("Validation devis échouée : %s", serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                devis_instance = serializer.save(client=client)

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

        except Exception:
            logger.exception("Erreur lors de la création d'un devis")
            return Response(
                {"error": "Une erreur technique interne est survenue."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )