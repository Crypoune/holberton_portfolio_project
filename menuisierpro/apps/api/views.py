# À compléter — sprint 2
from rest_framework import viewsets, permissions
from menuisier.models import Chantier, Temoignage, Devis
from .serializers import ChantierSerializer, TemoignageSerializer, DevisSerializer


class ChantierViewSet(viewsets.ModelViewSet):
    queryset            = Chantier.objects.filter(est_termine=True)
    serializer_class    = ChantierSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field        = 'slug'


class TemoignageViewSet(viewsets.ModelViewSet):
    queryset            = Temoignage.objects.filter(est_valide=True)
    serializer_class    = TemoignageSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]


class DevisViewSet(viewsets.ModelViewSet):
    queryset            = Devis.objects.all()
    serializer_class    = DevisSerializer
    permission_classes  = [permissions.IsAuthenticated]
