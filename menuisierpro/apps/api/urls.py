from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = DefaultRouter()
router.register(r'chantiers',   views.ChantierViewSet,   basename='chantier')
router.register(r'temoignages', views.TemoignageViewSet, basename='temoignage')
router.register(r'devis',       views.DevisViewSet,      basename='devis')

urlpatterns = [
    path('auth/', obtain_auth_token, name='api_token_auth'),
    path('', include(router.urls)),
]