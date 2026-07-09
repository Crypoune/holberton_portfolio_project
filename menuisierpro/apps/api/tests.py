from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.menuisier.models import Chantier
from apps.menuisier.models import Devis, Client_Prospect

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
        self.assertEqual(len(response.data['results']), 1)

    def test_CREATE_chantier_interdit_anonyme(self):
        """Vérifie qu'un visiteur anonyme ne peut pas créer de chantier (non authentifié)"""
        nouveau_chantier_data = {
        "titre": "Placard secret",
        "type_travaux": "Menuiserie intérieure"
        }
        response = self.client.post(self.url_liste, nouveau_chantier_data)
        # 401 (pas authentifié du tout) et non 403 (authentifié mais refusé) :
        # DRF distingue les deux selon que l'authentification a ou non abouti.
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

class DevisAPITestCase(APITestCase):
    """Vérifie le verrou serveur (mission 3) et le filtrage (mission de ce message)."""

    def setUp(self):
        self.artisan = User.objects.create_superuser(
            username='artisan_boss', password='password123', email='boss@menuisierpro.com'
        )
        self.client_standard = User.objects.create_user(
            username='client_standard', password='password123', is_staff=False
        )

        client_prospect = Client_Prospect.objects.create(
            nom="Rakoto Michel", telephone_whatsapp="261340001234"
        )

        self.devis_chene_attente = Devis.objects.create(
            client=client_prospect, type_meuble="Table basse",
            materiau="Chêne massif", statut=Devis.Statut.EN_ATTENTE,
        )
        self.devis_pin_j3 = Devis.objects.create(
            client=client_prospect, type_meuble="Armoire",
            materiau="Pin", statut=Devis.Statut.RELANCE_J3,
        )

        self.url_liste = reverse('devis-list')

    # --- Sécurité : le vrai objet de la mission 3 ---

    def test_LIST_devis_interdit_anonyme(self):
        """Un visiteur non connecté ne doit voir aucun devis."""
        response = self.client.get(self.url_liste)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_LIST_devis_interdit_utilisateur_standard(self):
        """
        Un compte authentifié mais non-staff doit être bloqué (403),
        même s'il possède un token/une session valide.
        """
        self.client.login(username='client_standard', password='password123')
        response = self.client.get(self.url_liste)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_LIST_devis_autorise_artisan(self):
        """L'artisan (staff) doit voir tous les devis."""
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url_liste)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_CREATE_devis_autorise_anonyme(self):
        """Le formulaire public de demande de devis doit rester ouvert à tous."""
        payload = {
            "nom": "Nouveau Client",
            "telephone_whatsapp": "261340009999",
            "type_meuble": "Bibliothèque",
            "materiau": "Chêne",
        }
        response = self.client.post(self.url_liste, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # --- Filtrage ---

    def test_FILTRE_par_materiau(self):
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url_liste, {"materiau": "chêne"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        resultats = response.data.get("results", response.data)
        self.assertEqual(len(resultats), 1)
        self.assertEqual(resultats[0]["id"], self.devis_chene_attente.id)

    def test_FILTRE_par_type_meuble(self):
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url_liste, {"type_meuble": "armoire"})
        resultats = response.data.get("results", response.data)
        self.assertEqual(len(resultats), 1)
        self.assertEqual(resultats[0]["id"], self.devis_pin_j3.id)

    def test_FILTRE_par_statut_relance_j3(self):
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url_liste, {"statut": "relance_j3"})
        resultats = response.data.get("results", response.data)
        self.assertEqual(len(resultats), 1)
        self.assertEqual(resultats[0]["id"], self.devis_pin_j3.id)

    def test_TRI_par_date_croissante(self):
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url_liste, {"ordering": "date_creation"})
        resultats = response.data.get("results", response.data)
        # Le premier créé (devis_chene_attente) doit apparaître en premier
        self.assertEqual(resultats[0]["id"], self.devis_chene_attente.id)


class DashboardStatsAPITestCase(APITestCase):
    """Vérifie la mission 4 : agrégats réels + verrou d'accès."""

    def setUp(self):
        self.artisan = User.objects.create_superuser(
            username='artisan_boss', password='password123', email='boss@menuisierpro.com'
        )
        self.client_standard = User.objects.create_user(
            username='client_standard', password='password123', is_staff=False
        )

        client_prospect = Client_Prospect.objects.create(
            nom="Test Client", telephone_whatsapp="261340005555"
        )
        Devis.objects.create(
            client=client_prospect, type_meuble="Table", statut=Devis.Statut.EN_ATTENTE
        )
        Devis.objects.create(
            client=client_prospect, type_meuble="Chaise", statut=Devis.Statut.CONVERTI
        )

        self.url = reverse('dashboard-stats')

    def test_ACCES_interdit_utilisateur_standard(self):
        self.client.login(username='client_standard', password='password123')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_STATS_correctes_pour_artisan(self):
        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["devis"]["total"], 2)
        self.assertEqual(response.data["devis"]["en_attente"], 1)
        self.assertEqual(response.data["devis"]["acceptes"], 1)
        self.assertEqual(response.data["total_clients"], 1)

    def test_STATS_sur_base_vide(self):
        """Doit renvoyer des zéros, jamais une erreur, sur une base sans données."""
        Devis.objects.all().delete()
        Client_Prospect.objects.all().delete()

        self.client.login(username='artisan_boss', password='password123')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["devis"]["total"], 0)
        self.assertEqual(response.data["dernieres_inscriptions"], [])