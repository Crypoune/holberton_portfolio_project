# À compléter — sprint 2
from rest_framework import serializers
from menuisier.models import Chantier, ImageChantier, Temoignage, Devis, Client_Prospect


class ImageChantierSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ImageChantier
        fields = ['id', 'fichier_image', 'categorie', 'ordre']


class ChantierSerializer(serializers.ModelSerializer):
    images = ImageChantierSerializer(many=True, read_only=True)

    class Meta:
        model  = Chantier
        fields = ['id', 'titre', 'description', 'type_travaux',
                  'materiau_utilise', 'budget_indicatif', 'localisation',
                  'slug', 'est_termine', 'date_debut', 'date_fin', 'images']


class TemoignageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Temoignage
        fields = ['id', 'contenu', 'note', 'est_valide', 'date_soumission']


class DevisSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Devis
        fields = ['id', 'type_meuble', 'dimensions_approximatives',
                  'materiau', 'message_whatsapp_genere', 'statut', 'date_creation']
