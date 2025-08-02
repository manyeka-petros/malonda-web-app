import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
from datetime import timedelta

# Load environment variables from .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY SETTINGS
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# INSTALLED APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Your apps
    'cartwhishlist',
    'orderediterm',
    'payment',
    'portalaccount',
    'products',

    # Third-party apps
    'corsheaders',  # CORS support for frontend
    'rest_framework',  # Django REST Framework
    'rest_framework_simplejwt.token_blacklist',  # JWT token blacklist
    'whitenoise.runserver_nostatic',  # Handle static files in dev
]

# MIDDLEWARE
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Serve static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Enable CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'malonda.urls'
AUTH_USER_MODEL = 'portalaccount.User'

# TEMPLATES
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],  # Optional templates folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'malonda.wsgi.application'

# DATABASE CONFIGURATION (Postgres for localhost)
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv("DATABASE_URL")  # Koyeb sets this automatically
    )
}

# STATIC & MEDIA FILES
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# DEFAULT PRIMARY KEY FIELD
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS (for frontend integration)
CORS_ALLOWED_ORIGINS = (
    os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') 
    if os.getenv('CORS_ALLOWED_ORIGINS') else []
)

# === REST FRAMEWORK & JWT SETTINGS ===
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

# JWT TOKEN LIFETIME SETTINGS
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# === PayChangu Settings ===
PAYCHANGU_PUBLIC_KEY = os.getenv('PAYCHANGU_PUBLIC_KEY')
PAYCHANGU_SECRET_KEY = os.getenv('PAYCHANGU_SECRET_KEY')
PAYCHANGU_CALLBACK_URL = os.getenv('PAYCHANGU_CALLBACK_URL')
PAYCHANGU_RETURN_URL = os.getenv('PAYCHANGU_RETURN_URL')
