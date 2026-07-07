from django.shortcuts import render, redirect, get_object_or_404
from .models import Temoignage



def soumettre_temoignage(request):
    token = request.GET.get('token')
    temoignage = get_object_or_404(Temoignage, token_validation=token)
    return render(request, 'menuisier/temoignage.html', {'temoignage': temoignage})