from django.urls import path
from . import views

app_name = 'menuisier'

urlpatterns = [
    path('temoignage/', views.soumettre_temoignage, name='temoignage'),
]
