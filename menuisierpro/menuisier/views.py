from django.shortcuts import render, get_object_or_404
from .models import Chantier, Temoignage


def accueil(request):
    chantiers_recents = Chantier.objects.filter(est_termine=True)[:3]
    temoignages = Temoignage.objects.filter(est_valide=True)[:6]
    return render(request, 'menuisier/accueil.html', {
        'chantiers': chantiers_recents,
        'temoignages': temoignages,
    })


def liste_chantiers(request):
    # Filtres GET optionnels : ?type=Cuisine&materiau=Chene
    qs = Chantier.objects.filter(est_termine=True)
    type_travaux = request.GET.get('type')
    materiau     = request.GET.get('materiau')
    if type_travaux:
        qs = qs.filter(type_travaux__icontains=type_travaux)
    if materiau:
        qs = qs.filter(materiau_utilise__icontains=materiau)
    return render(request, 'menuisier/chantiers.html', {'chantiers': qs})


def detail_chantier(request, slug):
    chantier = get_object_or_404(Chantier, slug=slug, est_termine=True)
    return render(request, 'menuisier/detail_chantier.html', {'chantier': chantier})


def devis(request):
    # La logique du générateur WhatsApp sera ici
    return render(request, 'menuisier/devis.html')


def soumettre_temoignage(request):
    token = request.GET.get('token')
    temoignage = get_object_or_404(Temoignage, token_validation=token)
    return render(request, 'menuisier/temoignage.html', {'temoignage': temoignage})
