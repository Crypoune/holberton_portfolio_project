from rest_framework import serializers
from apps.menuisier.models import Devis
from .client_prospect import ClientProspectSerializer


class DevisSerializer(serializers.ModelSerializer):
    client = ClientProspectSerializer(read_only=True)

    class Meta:
        model  = Devis
        fields = [
            'id', 'client', 'type_meuble', 'dimensions_approximatives',
            'materiau', 'message_whatsapp_genere', 'statut',
            'date_creation', 'date_relance_j3', 'date_relance_j7',
        ]
        read_only_fields = [
            'message_whatsapp_genere',  # généré automatiquement dans la view
            'statut',                   # géré par le relanceur, pas le client
            'date_creation',
            'date_relance_j3',
            'date_relance_j7',
        ]


class DevisCreationSerializer(serializers.ModelSerializer):
    """
    Utilisé uniquement pour la création depuis le formulaire public.
    Le visiteur remplit type_meuble, dimensions, materiau.
    message_whatsapp_genere est construit dans la view avant save().
    """
    class Meta:
        model  = Devis
        fields = ['type_meuble', 'dimensions_approximatives', 'materiau']


class DevisStatutSerializer(serializers.ModelSerializer):
    """
    Utilisé pour l'endpoint PATCH /api/v1/devis/:id/statut/
    Seul l'artisan peut changer le statut d'un devis.
    """
    class Meta:
        model  = Devis
        fields = ['statut']
