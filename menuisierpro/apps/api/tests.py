from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.menuisier.models import Chantier

class ChantierAPITestCase(APITestCase):

    def setUp(self):
        # 1. On crée le patron de l'atelier (l'artisan admin)
        self.artisan = User.objects.create_superuser(
            username='artisan_boss',
            password='password123',
            email='boss@menuisierpro.com'
        )
        
        # 2. On crée une première pièce de bois d'essai (un chantier existant)
        self.chantier_existant = Chantier.objects.create(
            titre="Table de conférence en Chêne",
            type_travaux="Mobilier Bureau",
            materiau_utilise="Chêne",
            est_termine=True  # Filtre automatique du ViewSet
        )
        
        # 3. Les URLs de notre API
        self.url_liste = reverse('chantier-list')  # /api/v1/chantiers/
        self.url_detail = reverse('chantier-detail', kwargs={'slug': self.chantier_existant.slug})

    def test_READ_public_chantiers(self):
        """Vérifie que n'importe quel visiteur peut voir la vitrine des chantiers"""
        response = self.client.get(self.url_liste)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_CREATE_chantier_interdit_anonyme(self):
        """Vérifie qu'un intrus ne peut pas créer de chantier (Sécurité Auth)"""
        nouveau_chantier_data = {
            "titre": "Placard secret",
            "type_travaux": "Menuiserie intérieure"
        }
        response = self.client.post(self.url_liste, nouveau_chantier_data)
        # On s'attend à ce que le verrou bloque l'accès (403 Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_CREATE_chantier_autorise_artisan(self):
        """Vérifie que l'artisan connecté peut bien fabriquer (Créer) un chantier"""
        # L'artisan présente son badge
        self.client.login(username='artisan_boss', password='password123')
        
        nouveau_chantier_data = {
            "titre": "Escalier hélicoïdal en Pin",
            "type_travaux": "Escalier",
            "materiau_utilise": "Pin",
            "est_termine": True
        }
        response = self.client.post(self.url_liste, nouveau_chantier_data)
        
        # On vérifie que la création est un succès (201 Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chantier.objects.count(), 2)

    def test_DELETE_chantier_autorise_artisan(self):
        """Vérifie que l'artisan peut détruire (Supprimer) une fiche chantier"""
        self.client.login(username='artisan_boss', password='password123')
        
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Chantier.objects.count(), 0)