from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# CHANGEMENT 1 — SECRET_KEY : plus de valeur par défaut
# ------------------------------------------------------------------
# Avant : os.getenv('SECRET_KEY', 'dev-secret-key')
# Le problème : si le .env n'est jamais chargé en prod (mauvais déploiement,
# volume Docker mal monté, oubli...), Django démarrait quand même avec une
# clé PUBLIQUE, visible dans ton repo Git. Cette clé sert à signer les
# sessions, les tokens de reset de mot de passe, etc. Si un attaquant la
# connaît, il peut forger des sessions valides.
# La correction : os.environ['SECRET_KEY'] lève une KeyError si la variable
# n'existe pas → le serveur plante au démarrage plutôt que de tourner en
# mode vulnérable. C'est le principe de "fail fast" : une erreur bruyante
# tout de suite vaut mieux qu'une faille silencieuse en prod.
SECRET_KEY = os.environ['SECRET_KEY']

# ------------------------------------------------------------------
# CHANGEMENT 2 — DEBUG : le défaut passe de 'True' à 'False'
# ------------------------------------------------------------------
# Même logique que pour SECRET_KEY : si la variable d'env DEBUG est absente
# en prod, tu veux te tromper du côté sûr (DEBUG=False), pas du côté
# dangereux (DEBUG=True qui affiche les stack traces complètes : chemins
# serveur, requêtes SQL, valeurs de variables...). En dev, il suffit de
# mettre DEBUG=True explicitement dans ton .env local.
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'apps.menuisier',
    'apps.api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]

WSGI_APPLICATION = 'config.wsgi.application'

if os.getenv('USE_SQLITE', 'False') == 'True':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    # ------------------------------------------------------------------
    # CORRECTION — DB_PASSWORD : même angle mort que SECRET_KEY
    # ------------------------------------------------------------------
    # Django lève une exception s'il manque le mot de passe de la DB
    # pour éviter de tourner en mode vulnérable avec mot de passe vide.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'menuisierpro'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.environ['DB_PASSWORD'],
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
            'OPTIONS': {
                'sslmode': os.getenv('DB_SSLMODE', 'prefer'),
            }
        }
    }

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Indian/Antananarivo'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / '.dist' / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ------------------------------------------------------------------
# CHANGEMENT 3 — Throttling DRF (anti brute-force)
# ------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/minute',
        'user': '100/minute',
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# ------------------------------------------------------------------
# CHANGEMENT 4 — CORS : whitelist explicite au lieu de rien
# ------------------------------------------------------------------
# django-cors-headers était installé mais aucune origine n'était déclarée.
# Par défaut ça bloque tout cross-origin (donc pas une faille en soi), mais
# ça veut aussi dire que le jour où ton frontend React est servi depuis un
# domaine différent du backend (ex: en prod, si tu ne passes pas par un
# même reverse-proxy), les requêtes échoueront silencieusement ou tu seras
# tenté de mettre CORS_ALLOW_ALL_ORIGINS = True en urgence — ce qu'il ne
# faut JAMAIS faire une fois que l'API gère des données sensibles (token
# d'auth notamment). Ici on déclare une whitelist pilotée par env, vide
# par défaut (donc rien d'ouvert tant que tu n'as pas configuré la variable).
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
    if origin.strip()
]

# ------------------------------------------------------------------
# CHANGEMENT 5 — Sécurité HTTPS / cookies, activée uniquement en prod
# ------------------------------------------------------------------
# On protège ces réglages derrière "if not DEBUG" parce qu'en dev tu
# travailles en http://localhost sans certificat TLS : si on forçait
# SECURE_SSL_REDIRECT = True tout le temps, ton serveur de dev refuserait
# de répondre en http.
#
# - SECURE_SSL_REDIRECT : redirige tout http:// vers https:// (empêche un
#   attaquant en Man-in-the-Middle sur un réseau wifi public d'intercepter
#   les requêtes en clair).
# - SESSION_COOKIE_SECURE / CSRF_COOKIE_SECURE : le navigateur n'envoie ces
#   cookies que sur une connexion https, jamais en clair.
# - SECURE_HSTS_SECONDS : dit au navigateur "ne reviens plus jamais en http
#   sur ce domaine pendant N secondes", même si l'utilisateur tape l'URL
#   sans https.
#
# ATTENTION (pédagogie importante) : si ton déploiement passe par un
# reverse-proxy (nginx, Docker) qui termine le TLS et transmet en http vers
# Django, il faut aussi configurer SECURE_PROXY_SSL_HEADER pour que Django
# sache que la requête d'origine était bien en https — sinon tu tombes dans
# une boucle de redirection infinie. À activer seulement quand tu es sûr
# que ton proxy envoie bien l'en-tête X-Forwarded-Proto.
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000  # 1 an, valeur recommandée par la doc une fois testé
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    # Décommente la ligne suivante seulement après avoir vérifié que ton
    # reverse-proxy transmet bien X-Forwarded-Proto :
    # SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ------------------------------------------------------------------
# CORRECTION — CSRF_TRUSTED_ORIGINS : oublié dans la première version
# ------------------------------------------------------------------
# Depuis Django 4, la protection CSRF vérifie que l'en-tête "Origin" de la
# requête correspond à un domaine explicitement autorisé — pas seulement
# ALLOWED_HOSTS. Sans ça, une fois derrière Nginx en https, l'admin Django
# (formulaires de connexion, ajout/édition d'un chantier...) renverra une
# erreur 403 "CSRF verification failed" même pour toi, l'admin légitime.
# C'est une contrainte de sécurité normale (ça empêche un site tiers de
# soumettre un formulaire à ta place), mais il faut déclarer ton propre
# domaine ici pour que ça ne te bloque pas toi-même.
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',')
    if origin.strip()
]

# ------------------------------------------------------------------
# CORRECTION — Limites d'upload (photos de chantier)
# ------------------------------------------------------------------
# Sans limite explicite, Django accepte par défaut jusqu'à 2.5 Mo en mémoire
# avant de basculer sur disque, mais rien n'empêche un envoi de plusieurs
# centaines de Mo de continuer à être traité et à saturer la RAM du serveur.
# Nginx a déjà une limite (client_max_body_size dans nginx.conf), mais la
# défense en profondeur veut qu'on la répète ici : si jamais Django est
# appelé directement (ex. debug local, ou mauvaise conf proxy), la limite
# s'applique quand même.
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 Mo, cohérent avec nginx.conf
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

# ------------------------------------------------------------------
# CORRECTION — LOGGING : rien n'était configuré
# ------------------------------------------------------------------
# Par défaut, Django n'écrit ses erreurs nulle part de façon fiable en prod
# quand DEBUG=False (c'est justement le rôle de Sentry qu'on a évoqué, mais
# Sentry est un service tiers optionnel — le logging natif ci-dessous ne
# dépend de rien d'externe et doit exister dans tous les cas). Ici, tout ce
# qui est niveau WARNING ou plus grave part sur la sortie standard, que
# Gunicorn capture déjà (voir Dockerfile.prod, --error-logfile -). C'est ce
# qui apparaît dans `docker logs` ou dans les logs de ton hébergeur.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}