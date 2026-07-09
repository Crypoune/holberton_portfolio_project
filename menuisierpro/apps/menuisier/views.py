# apps/menuisier/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from apps.api.serializers import TemoignageSoumissionSerializer
from .models import Temoignage


@require_http_methods(["GET", "POST"])
def soumettre_temoignage(request):
    token = request.GET.get("token") or request.POST.get("token")
    temoignage = get_object_or_404(Temoignage, token_validation=token)

    # Une fois soumis, le lien ne doit plus permettre de re-soumettre
    if temoignage.contenu:
        return render(request, "menuisier/temoignage_deja_soumis.html", {"temoignage": temoignage})

    if request.method == "POST":
        serializer = TemoignageSoumissionSerializer(instance=temoignage, data=request.POST)
        if serializer.is_valid():
            serializer.save()  # est_valide reste False -> l'artisan valide ensuite dans l'admin
            return render(request, "menuisier/temoignage_merci.html")
        return render(request, "menuisier/temoignage.html", {
            "temoignage": temoignage, "errors": serializer.errors,
        })

    return render(request, "menuisier/temoignage.html", {"temoignage": temoignage})