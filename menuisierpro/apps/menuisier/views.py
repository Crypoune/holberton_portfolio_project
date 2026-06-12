from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db import transaction  # Pour sécuriser l'assemblage en BD
from .models import Chantier, Temoignage, Client_Prospect, Devis
from .forms import DevisForm


def accueil(request):
    chantiers_recents = Chantier.objects.filter(est_termine=True)[:3]
    temoignages = Temoignage.objects.filter(est_valide=True)[:6]
    return render(request, 'menuisier/accueil.html', {
        'chantiers': chantiers_recents,
        'temoignages': temoignages,
    })


def liste_chantiers(request):
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
    """
    Générateur de devis WhatsApp optimisé avec protection transactionnelle.
    """
    if request.method == 'POST':
        form = DevisForm(request.POST)
        nom_client = request.POST.get('nom', '').strip()
        telephone  = request.POST.get('telephone_whatsapp', '').strip()
        email_client = request.POST.get('email', '').strip()

        if form.is_valid() and nom_client and telephone:
            try:
                # Utilisation d'un bloc atomique : tout passe ou tout s'annule
                with transaction.atomic():
                    # 1. On récupère ou on crée le client
                    client, created = Client_Prospect.objects.get_or_create(
                        telephone_whatsapp=telephone,
                        defaults={'nom': nom_client, 'email': email_client}
                    )

                    # 2. On prépare le devis en mémoire
                    devis_instance = form.save(commit=False)
                    devis_instance.client = client

                    # 3. Optimisation du message WhatsApp (Clair et direct dès le départ)
                    # Note : Ton admin tronquant à 100 caractères le lien rapide,
                    # l'essentiel est placé sur la première ligne.
                    devis_instance.message_whatsapp_genere = (
                        f"Devis Pro #{client.nom} : {devis_instance.type_meuble}\n\n"
                        f"Bonjour {client.nom},\n"
                        f"J'ai bien reçu votre demande pour votre projet de \"{devis_instance.type_meuble}\" "
                        f"({devis_instance.dimensions_approximatives}) en {devis_instance.materiau or 'bois'}.\n\n"
                        f"Je prépare l'estimation budgétaire et je reviens vers vous rapidement.\n"
                        f"Cordialement."
                    )

                    # 4. Enregistrement définitif
                    devis_instance.save()

                messages.success(request, "Votre demande de devis a bien été transmise !")
                return redirect('menuisier:accueil')

            except Exception:
                messages.error(request, "Une erreur technique est survenue lors de l'enregistrement.")
        else:
            messages.error(request, "Veuillez remplir correctement tous les champs obligatoires.")
    else:
        form = DevisForm()

    return render(request, 'menuisier/devis.html', {'form': form})


def soumettre_temoignage(request):
    token = request.GET.get('token')
    temoignage = get_object_or_404(Temoignage, token_validation=token)
    return render(request, 'menuisier/temoignage.html', {'temoignage': temoignage})