import re
from datetime import timedelta
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
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
    Générateur de devis WhatsApp avec validations et limitation de débit (anti-spam).
    """
    if request.method == 'POST':
        form = DevisForm(request.POST, request.FILES)
        nom_client = request.POST.get('nom', '').strip()
        telephone = request.POST.get('telephone_whatsapp', '').strip()
        email_client = request.POST.get('email', '').strip()
        code_postal = request.POST.get('code_postal', '').strip()
        ville = request.POST.get('ville', '').strip()

        # Validations
        if not nom_client or not telephone:
            messages.error(request, "Le nom et le numéro WhatsApp sont obligatoires.")
            return render(request, 'menuisier/devis.html', {'form': form})

        if not code_postal or not ville:
            messages.error(request, "Le code postal et la ville sont indispensables.")
            return render(request, 'menuisier/devis.html', {'form': form})

        if not re.match(r'^[a-zA-ZÀ-ÿ\s\-\']{3,100}$', nom_client):
            messages.error(request, "Le nom doit comporter entre 3 et 100 caractères (lettres uniquement).")
            return render(request, 'menuisier/devis.html', {'form': form})

        if email_client:
            try:
                validate_email(email_client)
            except ValidationError:
                messages.error(request, "Le format de l'adresse e-mail est invalide.")
                return render(request, 'menuisier/devis.html', {'form': form})

        # Téléphone validation et normalisation
        tel_clean = telephone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not tel_clean.startswith('+'):
            messages.error(request, "Le numéro doit commencer par '+' suivi du code pays (ex: +261 ou +33).")
            return render(request, 'menuisier/devis.html', {'form': form})

        if tel_clean.startswith('+261'):
            local = tel_clean[4:]
            if not re.match(r'^3[23489]\d{7}$', local):
                messages.error(request, "Pour Madagascar, le numéro après +261 doit faire 9 chiffres et commencer par 32, 33, 34, 38 ou 39.")
                return render(request, 'menuisier/devis.html', {'form': form})
        elif tel_clean.startswith('+33'):
            local = tel_clean[3:]
            if not re.match(r'^[1-9]\d{8}$', local):
                messages.error(request, "Pour la France, le numéro après +33 doit faire 9 chiffres (sans le 0 initial).")
                return render(request, 'menuisier/devis.html', {'form': form})
        elif tel_clean.startswith('+262'):
            local = tel_clean[4:]
            if not re.match(r'^[1-9]\d{8}$', local):
                messages.error(request, "Pour la Réunion ou Mayotte, le numéro après +262 doit faire 9 chiffres.")
                return render(request, 'menuisier/devis.html', {'form': form})
        else:
            if not re.match(r'^\+[1-9]\d{7,14}$', tel_clean):
                messages.error(request, "Le format du numéro de téléphone international est invalide.")
                return render(request, 'menuisier/devis.html', {'form': form})

        # Limitation de débit IP / Téléphone
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        cooldown_time = timezone.now() - timedelta(minutes=15)

        if Devis.objects.filter(ip_address=ip, date_creation__gte=cooldown_time).count() >= 3:
            messages.error(request, "Limite de demandes atteinte pour cette adresse IP. Veuillez patienter 15 minutes.")
            return render(request, 'menuisier/devis.html', {'form': form})

        if Devis.objects.filter(client__telephone_whatsapp=tel_clean, date_creation__gte=cooldown_time).count() >= 3:
            messages.error(request, "Limite de demandes atteinte pour ce numéro de téléphone. Veuillez patienter 15 minutes.")
            return render(request, 'menuisier/devis.html', {'form': form})

        if form.is_valid():
            try:
                with transaction.atomic():
                    # 1. On récupère ou on crée le client
                    client, created = Client_Prospect.objects.get_or_create(
                        telephone_whatsapp=tel_clean,
                        defaults={'nom': nom_client, 'email': email_client}
                    )
                    if not created and email_client and not client.email:
                        client.email = email_client
                        client.save()

                    # 2. On prépare le devis en mémoire
                    devis_instance = form.save(commit=False)
                    devis_instance.client = client
                    devis_instance.ip_address = ip

                    # 3. Optimisation du message WhatsApp
                    product_label = devis_instance.type_meuble or devis_instance.type_produit or "Menuiserie"
                    devis_instance.message_whatsapp_genere = (
                        f"Devis Pro #{client.nom} : {product_label}\n\n"
                        f"Bonjour {client.nom},\n"
                        f"J'ai bien reçu votre demande de devis pour un projet de \"{product_label}\" ({devis_instance.type_client or 'Particulier'}) :\n"
                        f"- Travaux : {devis_instance.type_travaux or 'Non précisé'}\n"
                        f"- Produit : {devis_instance.type_produit or 'Non précisé'}\n"
                        f"- Quantité : {devis_instance.quantite or 1}\n"
                        f"- Dimensions : {devis_instance.dimensions_approximatives or 'non précisées'}\n"
                        f"- Matériau : {devis_instance.materiau or 'non précisé'}\n"
                        f"- Localisation : {devis_instance.code_postal} {devis_instance.ville}\n"
                        f"- Délai : {devis_instance.delai or 'Non précisé'}\n"
                        f"- Budget : {devis_instance.budget or 'non précisé'}\n"
                        f"- Description : {devis_instance.description or 'aucune'}\n\n"
                        f"Je prépare l'estimation budgétaire et je reviens vers vous rapidement.\n"
                        f"Cordialement."
                    )

                    # 4. Enregistrement définitif
                    devis_instance.save()

                messages.success(request, "Votre demande de devis a bien été transmise !")
                return redirect('menuisier:accueil')

            except Exception as e:
                messages.error(request, f"Une erreur technique est survenue lors de l'enregistrement : {str(e)}")
        else:
            messages.error(request, "Veuillez remplir correctement tous les champs obligatoires.")
    else:
        form = DevisForm()

    return render(request, 'menuisier/devis.html', {'form': form})


def soumettre_temoignage(request):
    token = request.GET.get('token')
    temoignage = get_object_or_404(Temoignage, token_validation=token)
    return render(request, 'menuisier/temoignage.html', {'temoignage': temoignage})