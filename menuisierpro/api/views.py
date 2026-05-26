# À compléter — sprint 2
from rest_framework import viewsets, permissions
from menuisier.models import Chantier, Temoignage, Devis
from .serializers import (
    ChantierSerializer, 
    TemoignageSerializer, 
    DevisSerializer, 
    DevisCreationSerializer, 
    DevisStatutSerializer
)


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
    queryset = Devis.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return DevisCreationSerializer
        elif self.action in ['partial_update', 'update']:
            return DevisStatutSerializer
        return DevisSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
