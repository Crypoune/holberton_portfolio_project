# À compléter — sprint 2
from django import forms
from .models import Devis, Temoignage


class DevisForm(forms.ModelForm):
    class Meta:
        model = Devis
        fields = [
            'type_meuble', 'dimensions_approximatives', 'materiau',
            'code_postal', 'ville', 'type_client', 'type_travaux',
            'type_produit', 'quantite', 'description', 'delai',
            'budget', 'photo_plan'
        ]


class TemoignageForm(forms.ModelForm):
    class Meta:
        model = Temoignage
        fields = ['contenu', 'note']
