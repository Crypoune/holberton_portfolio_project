from rest_framework import serializers
from apps.menuisier.models import Devis


class DevisSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Devis
        fields = [
            'id', 'client', 'type_meuble', 'dimensions_approximatives',
            'materiau',
            'code_postal', 'ville', 'type_client', 'type_travaux',
            'type_produit', 'quantite', 'budget', 'delai', 'description',
            'photo_plan', 'message_whatsapp_genere',
            'statut', 'ip_address', 'date_creation', 'date_relance_j3', 'date_relance_j7',
        ]
        read_only_fields = [
            'message_whatsapp_genere',  # généré automatiquement dans la view
            'statut',                   # géré par le relanceur, pas le client
            'ip_address',
            'date_creation',
            'date_relance_j3',
            'date_relance_j7',
        ]


class DevisCreationSerializer(serializers.ModelSerializer):
    """
    Utilisé uniquement pour la création depuis le formulaire public.
    """
    class Meta:
        model  = Devis
        fields = [
            'type_meuble', 'dimensions_approximatives', 'materiau',
            'code_postal', 'ville', 'type_client', 'type_travaux',
            'type_produit', 'quantite', 'description', 'delai',
            'budget', 'photo_plan'
        ]


class DevisStatutSerializer(serializers.ModelSerializer):
    """
    Utilisé pour l'endpoint PATCH /api/v1/devis/:id/statut/
    Seul l'artisan peut changer le statut d'un devis.
    """
    class Meta:
        model  = Devis
        fields = ['statut']
