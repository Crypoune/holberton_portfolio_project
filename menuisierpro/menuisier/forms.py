# À compléter — sprint 2
from django import forms
from .models import Devis, Temoignage


class DevisForm(forms.ModelForm):
    class Meta:
        model = Devis
        fields = ['type_meuble', 'dimensions_approximatives', 'materiau']


class TemoignageForm(forms.ModelForm):
    class Meta:
        model = Temoignage
        fields = ['contenu', 'note']
