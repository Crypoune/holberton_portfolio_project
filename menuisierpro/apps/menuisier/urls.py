from django.urls import path
from . import views

app_name = 'menuisier'

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('chantiers/', views.liste_chantiers, name='liste_chantiers'),
    path('chantiers/<slug:slug>/', views.detail_chantier, name='detail_chantier'),
    path('devis/', views.devis, name='devis'),
    path('temoignage/', views.soumettre_temoignage, name='temoignage'),
]
