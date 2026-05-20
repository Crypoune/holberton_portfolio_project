from rest_framework import serializers
from menuisier.models import Client_Prospect


class ClientProspectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Client_Prospect
        fields = ['id', 'nom', 'telephone_whatsapp', 'email', 'date_creation']
        # date_creation en lecture seule — généré automatiquement
        read_only_fields = ['date_creation']
