#  GEPETTO'S HOUSE — Site Web Dynamique & Espace Gestion pour Artisan Menuisier

Projet full-stack découplé (React / Django REST Framework) développé pour un artisan menuisier-charpentier basé à Madagascar. Ce projet répond à des contraintes locales fortes (réseau mobile 3G/4G instable, coûts de data, usage prédominant de WhatsApp) tout en offrant une interface d'administration premium et sécurisée pour la gestion des chantiers et prospects.

---

## 1. Architecture Système & Flux de Données

Le projet adopte une architecture découplée moderne et performante, optimisée pour le bas débit et la robustesse en production.

```mermaid
graph TB
    subgraph "Clients (Navigateurs)"
        Client[Visiteur / Prospect]
        Artisan[Artisan / Admin]
    end

    subgraph "Proxy Nginx (Port 80/443)"
        Nginx{Nginx Reverse Proxy}
    end

    subgraph "Backend Django (Port 8000)"
        DRF[Django REST Framework]
        DjangoAdmin[Django Admin Custom]
        Pillow[Pillow Optimizer]
        Templates[Django HTML Templates]
    end

    subgraph "Frontend React (Port 5173 / Dist)"
        Vite[React SPA - Vite]
    end

    subgraph "Persistance & Stockage"
        DB[(PostgreSQL / SQLite)]
        Media[Media Storage /media/]
    end

    subgraph "Intégration Externe"
        WA[API WhatsApp Wa.me]
    end

    %% Routing
    Client -->|Accès Site / Devis| Vite
    Artisan -->|Gestion Dashboard / Authentification| Vite
    Vite -->|Requêtes REST /api/v1/| Nginx
    Client -.->|Soumission Avis direct /temoignage/| Nginx

    Nginx -->|Route /static/ & /media/| Nginx
    Nginx -->|Proxy pass API & Admin| DRF
    Nginx -->|Proxy pass Avis HTML| Templates

    %% Backend internal
    DRF --> DB
    DjangoAdmin --> DB
    Templates --> DB

    %% Media handling
    DjangoAdmin -->|Upload Images| Pillow
    Pillow -->|Compression & Enregistrement| Media

    %% External
    DRF -.->|Génération Wa.me Link| WA
    Artisan -.->|Bouton Relance WhatsApp| WA
```

### Composants techniques :
- **Frontend SPA** : Développé en **React 19** avec **Vite**, **SASS** pour le design système, et **Lucide Icons** pour la clarté visuelle. Communique exclusivement via l'API REST sécurisée.
- **Backend API REST** : Alimenté par **Django** et **Django REST Framework (DRF)**. Il gère l'authentification (Token-based), l'anti-spam par IP, et les routes CRUD des ressources.
- **Formulaire de collecte d'avis (Django Templates)** : Pour alléger au maximum la charge réseau des clients sur smartphone, la saisie des témoignages se fait sur des pages HTML5 traditionnelles épurées, servies directement par Django (Django Templates + CSS natif) via des jetons sécurisés (Tokens) à usage unique.
- **Reverse Proxy & Serveur Web** : **Nginx** gère la redirection SSL, sert directement le dossier de médias `/media/` et les fichiers statiques de l'admin `/static/`, et relaie l'API au serveur d'application **Gunicorn (WSGI)**.
- **Base de Données** : **PostgreSQL** pour la production (garantissant la fiabilité des relations), et **SQLite** en option locale pour simplifier le développement initial.
- **Optimisation d'Images** : La bibliothèque **Pillow** intercepte les téléversements de photos par l'artisan, les redimensionne à un maximum de 1200x1200px et applique une compression JPEG à 70%. Cela réduit le poids moyen des fichiers de 5 Mo à moins de 300 Ko pour préserver le forfait data 3G/4G des visiteurs malgaches.

---

## 2. Fonctionnalités & Spécifications Métier (MoSCoW)

L'application a été conçue et priorisée pour offrir une valeur métier immédiate à l'artisan sans ajouter de complexité inutile.

###  Must Have (Indispensable)
- **Générateur de devis WhatsApp** : Formulaire interactif en plusieurs étapes permettant au prospect de configurer sa demande de mobilier (type, dimensions, essence de bois, budget, plan/photo).
- **Console d'Administration Sécurisée** : Espace réservé à l'artisan pour visualiser les devis reçus, suivre le statut des clients, et modérer les avis.
- **Intégration Click-to-Chat WhatsApp** : Bouton sur chaque carte devis permettant à l'artisan de démarrer immédiatement une conversation WhatsApp avec le client sans ajouter manuellement le numéro à ses contacts.

###  Should Have (Important)
- **Portfolio Dynamique & Lightbox** : Galerie photo fluide présentant les chantiers réalisés (filtrable par matériau et type de travaux) avec un affichage grand écran des photos avant/après.
- **Carrousels animés (Marquee)** : Défilement fluide horizontal automatique des réalisations et des retours clients sur la page d'accueil pour donner une impression de dynamisme.

###  Could Have (Optionnel)
- **Collecte automatique de témoignages** : Système générant un lien à usage unique envoyé par l'artisan à son client à la fin d'un chantier. Ce lien permet de récolter une note et un texte de satisfaction.

###  Won't Have (Exclu de la V1)
- **Paiement en ligne** : Non implémenté en raison des contraintes techniques et réglementaires sur les passerelles de paiement à Madagascar.

---

## 3. Modèle de Données (Base de Données)

Le schéma relationnel ci-dessous détaille la structure des tables PostgreSQL implémentées dans l'application.

```mermaid
erDiagram
    USER {
        int id PK
        varchar username
        varchar password
        boolean is_staff
        boolean is_superuser
        varchar email
        timestamp date_joined
    }
    AUTH_TOKEN {
        varchar key PK
        int user_id FK
        timestamp created
    }
    CLIENT_PROSPECT {
        int id PK
        varchar nom
        varchar telephone_whatsapp
        varchar email
        timestamp date_creation
    }
    CHANTIER {
        int id PK
        int client_id FK
        varchar titre
        text description
        varchar type_travaux
        varchar materiau_utilise
        int budget_indicatif
        varchar localisation
        varchar slug
        boolean est_termine
        date date_debut
        date date_fin
    }
    IMAGE_CHANTIER {
        int id PK
        int chantier_id FK
        varchar fichier_image
        varchar categorie
        smallint ordre
    }
    DEVIS {
        int id PK
        int client_id FK
        varchar type_meuble
        varchar dimensions_approximatives
        varchar materiau
        text message_whatsapp_genere
        timestamp date_creation
        varchar statut
        timestamp date_relance_j3
        timestamp date_relance_j7
    }
    TEMOIGNAGE {
        int id PK
        int chantier_id FK
        int client_id FK
        text contenu
        smallint note
        boolean est_valide
        uuid token_validation
        timestamp date_soumission
    }

    USER ||--o| AUTH_TOKEN : "possede"
    CLIENT_PROSPECT o|--o{ CHANTIER : "commande"
    CLIENT_PROSPECT o|--o{ DEVIS : "demande"
    CLIENT_PROSPECT o|--o{ TEMOIGNAGE : "redige"
    CHANTIER ||--o{ IMAGE_CHANTIER : "illustre_par"
    CHANTIER ||--o| TEMOIGNAGE : "fait_objet_de"
```

### Règles de transition des statuts de Devis :
- **`en_attente`** : Statut initial lors de la soumission par le prospect.
- **`relance_j3` / `relance_j7`** : Indique que l'artisan a envoyé la relance à J+3 ou J+7.
- **`converti`** : Quand le devis débouche sur la création d'un chantier.
- **`abandonne`** : En cas de refus ou d'absence de réponse après J+7.

---

## 4. Flux Clés & Diagrammes de Séquence

Les séquences ci-dessous reflètent le comportement réel implémenté dans le code (`DevisViewSet.create()`, `useQuotes.js`, `QuotesCard.jsx`), qui diverge sur certains points d'une version idéale décrite plus haut : à ce stade, la génération du lien WhatsApp de relance ne déclenche aucune écriture en base, et les dates de relance (`date_relance_j3`/`date_relance_j7`) ne sont pas calculées automatiquement à la création — ces points sont signalés en note à la fin de chaque diagramme.

### A. Soumission d'une demande de devis (Visiteur public)

Le formulaire public envoie un JSON simple, traité par une méthode `create()` surchargée qui combine récupération/création du client et validation du devis dans une même transaction.

```mermaid
sequenceDiagram
    actor Visiteur as Prospect (Visiteur)
    participant Front as SPA React (Vite)
    participant API as DevisViewSet (DRF)
    participant DB as PostgreSQL

    Visiteur->>Front: Remplit le formulaire (nom, telephone_whatsapp, type_meuble, dimensions, materiau)
    Front->>API: POST /api/v1/devis/ (JSON — action "create", AllowAny)
    Note over API: Throttle DRF global (AnonRateThrottle, 20 req/min)

    API->>API: Vérifie que nom et telephone_whatsapp sont fournis
    alt Champ obligatoire manquant
        API-->>Front: 400 Bad Request
    else Champs présents
        API->>DB: transaction.atomic() -> Client_Prospect.get_or_create(telephone_whatsapp)
        DB-->>API: Client (existant ou nouvellement créé)
        API->>API: DevisCreationSerializer valide type_meuble / dimensions / materiau
        alt Validation échouée
            API-->>Front: 400 Bad Request (erreurs de validation)
        else Validation OK
            API->>DB: INSERT INTO devis (statut = en_attente par défaut)
            API->>API: Construit message_whatsapp_genere (gabarit texte)
            API->>DB: UPDATE devis SET message_whatsapp_genere
            API-->>Front: 201 Created (devis + client en JSON)
        end
    end
    Front-->>Visiteur: Affiche l'écran de confirmation
```

### B. Consultation et relance manuelle des devis (Espace Artisan)

Après authentification, le dashboard récupère en parallèle la liste des devis et les statistiques. Le bouton de relance ouvre directement une conversation WhatsApp pré-remplie ; il ne déclenche aucun appel API à ce stade.

```mermaid
sequenceDiagram
    actor Artisan as Artisan (Admin)
    participant Login as Login.jsx
    participant Dash as Dashboard React (useQuotes)
    participant API as API DRF (IsArtisanStaff)
    participant DB as PostgreSQL
    participant WA as WhatsApp (wa.me)

    Artisan->>Login: Saisit identifiant / mot de passe
    Login->>API: POST /api/v1/auth/ (obtain_auth_token)
    API-->>Login: 200 OK { token } ou 400 si identifiants invalides
    Login->>Dash: onLoginSuccess(token) — token conservé côté App.jsx

    Dash->>API: Promise.all -> GET /api/v1/devis/?statut=... & GET /api/v1/dashboard/stats/
    API->>API: Vérifie IsArtisanStaff (401/403 sinon)
    alt Token invalide ou droits insuffisants
        API-->>Dash: 401 / 403
        Dash->>Dash: handleResponse() déclenche onAuthError (déconnexion)
    else Accès autorisé
        API->>DB: SELECT devis filtrés + agrégation des statistiques
        DB-->>API: Résultats
        API-->>Dash: 200 OK (liste des devis + statistiques)
    end

    Dash->>Dash: QuotesCard.labelButton() calcule "Relance J+3" / "Relance J+7" / "Contacter" à partir des dates déjà stockées
    Artisan->>Dash: Clique sur le bouton WhatsApp de la carte devis
    Dash->>WA: Ouvre wa.me/{telephone}?text={message_whatsapp_genere}
    WA-->>Artisan: Conversation WhatsApp pré-remplie
    Note over Dash,DB: Dans cette version, le clic n'entraîne aucune mise à jour du statut ou des dates de relance en base — la ressource DevisStatutSerializer existe mais n'est pas encore câblée à une route ni à une action frontend.
```

### C. Suppression d'un devis (Espace Artisan)

Suppression avec confirmation et mise à jour optimiste de l'interface, avec retour arrière en cas d'échec.

```mermaid
sequenceDiagram
    actor Artisan as Artisan (Admin)
    participant Card as QuotesCard.jsx
    participant Dash as useQuotes.js
    participant API as API DRF (IsArtisanStaff)
    participant DB as PostgreSQL

    Artisan->>Card: Clique sur l'icône de suppression
    Card->>Card: window.confirm() — demande de confirmation
    alt Annulation
        Card-->>Artisan: Aucune action
    else Confirmé
        Card->>Dash: deleteQuote(id)
        Dash->>Dash: Retire immédiatement le devis de la liste affichée (optimiste)
        Dash->>API: DELETE /api/v1/devis/{id}/
        API->>API: Vérifie IsArtisanStaff (401/403 sinon)
        alt Suppression réussie
            API->>DB: DELETE FROM devis WHERE id = {id}
            API-->>Dash: 204 No Content
            Dash->>Dash: Rafraîchit le dashboard (fetchDashboard)
        else Échec (401/403 ou erreur serveur)
            API-->>Dash: Code d'erreur
            Dash->>Dash: Restaure la liste précédente (rollback)
            Dash-->>Artisan: Message d'erreur (window.alert)
        end
    end
```

---

## 5. Spécifications des APIs

### API Externe (WhatsApp click-to-chat)
- **Base URL** : `https://wa.me/{telephone}`
- **Paramètres** : `?text={url_encoded_message}`
- **Usage** : Permet d'ouvrir une fenêtre de discussion pré-remplie avec le prospect.

### APIs Internes (REST)

Toutes les routes internes sont préfixées par `/api/v1/`.

| Méthode | Endpoint | Authentification | Description |
|---|---|---|---|
| `POST` | `/auth/` | Non | Échange identifiants contre Token DRF |
| `GET` | `/chantiers/` | Non | Récupère la liste des chantiers validés |
| `POST` | `/devis/` | Non | Soumet un formulaire de devis (Honeypot + Rate Limit) |
| `GET` | `/devis/` | Token requis | Récupère tous les devis (filtrable par statut/materiau) |
| `DELETE`| `/devis/{id}/` | Token requis | Supprime définitivement un devis |
| `GET` | `/dashboard/stats/` | Token requis | Retourne les indicateurs de performances généraux |

#### Exemple : Soumission d'un Devis (`POST /api/v1/devis/`)
**Requête (Multipart/FormData) :**
- `nom` : `"Jean Rakoto"`
- `telephone_whatsapp` : `"+261340001234"`
- `email` : `"jean.rakoto@gmail.com"` (facultatif)
- `code_postal` : `"101"`
- `ville` : `"Antananarivo"`
- `type_client` : `"Particulier"`
- `type_travaux` : `"Rénovation (remplacement)"`
- `type_produit` : `"Menuiserie intérieure (Escalier, Dressing, Portes)"`
- `type_meuble` : `"Menuiserie intérieure (Escalier, Dressing, Portes)"`
- `dimensions_approximatives` : `"200x80x10cm"`
- `quantite` : `1`
- `materiau` : `"Palissandre"`
- `description` : `"Besoin d'une porte intérieure en bois dur."`
- `delai` : `"Sous 3 mois"`
- `budget` : `"Entre 2 000 € et 5 000 €"`
- `photo_plan` : `[Fichier Image]`
- `site_web` : `""` (Champ invisible anti-spam, doit impérativement rester vide)

**Réponse (HTTP 201 Created) :**
```json
{
  "id": 42,
  "client": {
    "id": 5,
    "nom": "Jean Rakoto",
    "telephone_whatsapp": "+261340001234",
    "email": "jean.rakoto@gmail.com"
  },
  "type_meuble": "Menuiserie intérieure (Escalier, Dressing, Portes)",
  "dimensions_approximatives": "200x80x10cm",
  "materiau": "Palissandre",
  "message_whatsapp_genere": "Devis Pro #Jean Rakoto : Menuiserie intérieure...\n\nBonjour Jean...",
  "statut": "en_attente",
  "date_creation": "2026-07-13T21:40:00Z",
  "date_relance_j3": "2026-07-16T21:40:00Z",
  "date_relance_j7": "2026-07-20T21:40:00Z"
}
```

---

## 6. Installation & Lancement Rapide

### Prérequis
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **OU** Python 3.12+ & Node.js 20+ installés localement.

### Option A. Lancement rapide via Docker Compose (Recommandé)

1. Clonez le dépôt et rendez-vous dans le répertoire du projet :
   ```bash
   git clone https://github.com/Crypoune/holberton_portfolio_project.git
   cd holberton_portfolio_project/menuisierpro
   ```
2. Créez votre fichier d'environnement `.env` à partir de l'exemple :
   ```bash
   cp .env.example .env
   ```
3. Démarrez les services (Base de données, Backend et Frontend) en mode développement :
   ```bash
   docker compose up -d --build
   ```
   *Le frontend React est alors disponible sur [http://localhost:5173](http://localhost:5173) et l'API Backend sur [http://localhost:8000](http://localhost:8000).*

4. Créez un compte administrateur (Superuser) pour accéder à l'espace de gestion et aux APIs sécurisées :
   ```bash
   docker compose exec web python manage.py createsuperuser
   ```

---

### Option B. Installation manuelle locale (Développement)

#### 1. Configuration du Backend Django
1. Naviguez dans le dossier de configuration backend :
   ```bash
   cd menuisierpro
   ```
2. Créez et activez un environnement virtuel Python :
   ```bash
   python -m venv .venv
   # Sur Windows (PowerShell) :
   .venv\Scripts\Activate.ps1
   # Sur macOS/Linux :
   source .venv/bin/activate
   ```
3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
4. Exécutez les migrations de base de données :
   ```bash
   python manage.py migrate
   ```
5. Lancez le serveur de développement local :
   ```bash
   python manage.py runserver
   ```
   *Le backend tourne sur [http://127.0.0.1:8000/](http://127.0.0.1:8000/).*

#### 2. Configuration du Frontend React
1. Ouvrez un nouveau terminal et allez dans le dossier frontend :
   ```bash
   cd menuisierpro/frontend
   ```
2. Installez les modules Node :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement Vite :
   ```bash
   npm run dev
   ```
   *L'application web est lancée sur [http://localhost:5173](http://localhost:5173).*

---

## 7. Sauvegardes & Maintenance (`backup.sh`)

Un script de sauvegarde unifié est présent dans `menuisierpro/backup.sh`. Il prend en charge la base de données PostgreSQL ou SQLite (selon la configuration courante).

### Fonctionnalités du script :
- **Détection Automatique** : Lit la variable `USE_SQLITE` dans le fichier `.env` pour déterminer le type de sauvegarde.
- **Compression** : Compresse automatiquement les dumps à l'aide de `gzip`.
- **Rotation simple** : Conserve uniquement les sauvegardes des **7 derniers jours** et supprime automatiquement les fichiers plus anciens pour éviter de saturer le disque.

### Planification du Backup via Cron (Serveur) :
Pour planifier la sauvegarde tous les jours à 3h du matin, ajoutez la ligne suivante dans votre crontab :
```cron
0 3 * * * /app/backup.sh >> /var/log/menuisierpro-backup.log 2>&1
```

---

## 8. Git Flow

Ce projet a été réalisé en binôme. Pour éviter tout conflit de code ou de migration de base de données :
- **Branche `main`** : Branche de production. Code stable et testé. Les commits directs y sont proscrits.
- **Branche `release/demo`** : Branche d'intégration globale servant de tronc commun de validation.
## 9. Equipe 

Contributeurs : 
Arnaud M. : arnaudmessenet@gmail.com, Jason JL. : jasonjeanlouis1@gmail.com, Thomas H. : thomas.haenel101@gmail.com
