# 🪵 GEPETTO'S HOUSE — Application Frontend React

Cette partie du projet contient l'application web client (Single Page Application) développée en **React 19** avec **Vite**, stylisée de manière modulaire à l'aide de **Sass (SCSS)** et d'icônes **Lucide React**.

L'application a été conçue selon une approche *Mobile-First*, optimisée spécifiquement pour les connexions mobiles à faible débit (3G) à Madagascar.

---

## 🚀 Lancement & Développement Local

### Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) (version 20 ou supérieure) installé sur votre machine.

### 1. Installation des dépendances
Naviguez dans le répertoire frontend et installez les modules requis :
```bash
cd menuisierpro/frontend
npm install
```

### 2. Démarrage du serveur de développement
Lancez le serveur local de Vite :
```bash
npm run dev
```
*L'application est alors accessible sur [http://localhost:5173](http://localhost:5173).*

### 3. Build pour la production
Pour générer les fichiers statiques optimisés (dist) prêts pour le déploiement Nginx :
```bash
npm run build
```

---

## 🗂️ Structure du Code source (`src/`)

L'application suit une structure claire, modulaire et hautement réutilisable :

```text
src/
├── assets/         # Images optimisées et logos de l'atelier
├── components/     # Composants d'interface partagés
│   ├── dashboard/  # Composants du tableau de bord artisan (Filtres, Cartes devis, etc.)
│   └── layout/     # Éléments de structure (Sidebar, Navigation)
├── hooks/          # Hooks personnalisés (useQuotes.js pour la synchronisation API)
├── pages/          # Vues principales de l'application
│   ├── Home.jsx           # Page d'accueil publique (Vitrine, témoignages)
│   ├── RequestQuote.jsx   # Formulaire de demande de devis (Honeypot + Multi-étapes)
│   ├── Login.jsx          # Écran de connexion de l'artisan (Jeton Token DRF)
│   └── Dashboard.jsx      # Tableau de bord interne de gestion des prospects
├── styles/         # Styles SCSS (Variables, Mixins, Design System)
├── App.jsx         # Composant racine gérant le routage applicatif
└── main.jsx        # Point d'entrée de l'application
```

---

## 🔌 Intégration API & Synchronisation

L'application communique de manière asynchrone avec le backend Django REST Framework :
* **Hook personnalisé `useQuotes.js`** : Centralise tous les appels vers les API sécurisées (`GET /api/v1/devis/` et `GET /api/v1/dashboard/stats/`). Il gère l'authentification par jeton (Token HTTP Authorization), le rafraîchissement des données et la suppression optimiste des devis.
* **Proxy de Développement** : Configuré dans `vite.config.js` pour rediriger les requêtes `/api/v1/` vers le conteneur ou serveur backend local, évitant ainsi les blocages de sécurité CORS en développement.

---

## ⚡ Optimisations clés pour le réseau mobile (3G)

1. **Zéro JavaScript d'Animation (Carrousel CSS)** : Le carrousel de témoignages et de réalisations utilise une animation de défilement infini (`Marquee`) réalisée à 100% en CSS via `@keyframes marquee-scroll`, réduisant à zéro l'impact CPU/JS sur les terminaux mobiles.
2. **Gestion fine des états** : Les boutons de soumission gèrent l'état asynchrone (`status === 'envoi'`) pour désactiver le bouton et interdire les doubles soumissions accidentelles lors de connexions ralenties.
3. **Chargement ciblé** : Grâce à la sérialisation imbriquée du backend, les images secondaires de chantiers ne sont téléchargées que lorsque le client clique sur un chantier spécifique, économisant ainsi la consommation de données internet.
