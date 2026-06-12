from rest_framework import serializers
from apps.menuisier.models import Chantier, ImageChantier


class ImageChantierSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ImageChantier
        fields = ['id', 'fichier_image', 'categorie', 'ordre']


class ChantierSerializer(serializers.ModelSerializer):
    # Imbriqué en lecture seule — les images se gèrent via leur propre endpoint
    images = ImageChantierSerializer(many=True, read_only=True)

    class Meta:
        model  = Chantier
        fields = [
            'id', 'titre', 'description', 'type_travaux',
            'materiau_utilise', 'budget_indicatif', 'localisation',
            'slug', 'est_termine', 'date_debut', 'date_fin',
            'images',
        ]
        # Le slug est généré automatiquement dans model.save()
        read_only_fields = ['slug']


class ChantierListSerializer(serializers.ModelSerializer):
    """
    Version allégée pour la liste des chantiers.
    N'inclut pas les images pour éviter les requêtes N+1.
    Utilisé dans ChantierViewSet.list()
    """
    image_principale = serializers.SerializerMethodField()

    class Meta:
        model  = Chantier
        fields = [
            'id', 'titre', 'type_travaux', 'materiau_utilise',
            'budget_indicatif', 'localisation', 'slug',
            'date_fin', 'image_principale',
        ]

    def get_image_principale(self, obj):
        # Retourne uniquement la première image "après" du chantier
        image = obj.images.filter(categorie='apres').order_by('ordre').first()
        if image:
            request = self.context.get('request')
            return request.build_absolute_uri(image.fichier_image.url) if request else image.fichier_image.url
        return None
