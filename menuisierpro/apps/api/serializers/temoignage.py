from rest_framework import serializers
from apps.menuisier.models import Temoignage


class TemoignageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Temoignage
        fields = [
            'id', 'chantier', 'client', 'contenu',
            'note', 'est_valide', 'date_soumission',
        ]
        read_only_fields = ['est_valide', 'date_soumission']
        # est_valide : seul l'artisan (admin) peut valider, pas le client


class TemoignagePublicSerializer(serializers.ModelSerializer):
    """
    Version publique — ne retourne que les champs affichables sur le site.
    Utilisé pour la liste des témoignages validés visible par les visiteurs.
    N'expose pas token_validation ni les données client.
    """
    chantier_titre = serializers.CharField(source='chantier.titre', read_only=True)
    chantier_slug  = serializers.CharField(source='chantier.slug',  read_only=True)

    class Meta:
        model  = Temoignage
        fields = ['id', 'contenu', 'note', 'date_soumission', 'chantier_titre', 'chantier_slug']


class TemoignageSoumissionSerializer(serializers.ModelSerializer):
    """
    Utilisé uniquement pour la soumission via token.
    Le client remplit uniquement contenu et note.
    """
    class Meta:
        model  = Temoignage
        fields = ['contenu', 'note']
