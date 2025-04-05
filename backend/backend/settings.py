from datetime import timedelta
from pathlib import Path
from celery.schedules import crontab 
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-igp4zng9i5t1zk@ry$7r964mw45rj#+*f#@)&5u#$d3ngh^w7$"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
# settings.py
TIME_ZONE = 'UTC'  # or 'Africa/Harare' for Zimbabwe time
USE_TZ = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://errandx.onrender.com',
    'http://127.0.0.1:5173'
]

CORS_TRUSTED_ORIGINS = [
    'https://errandx.onrender.com/',
    'http://localhost:5173',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['content-type', 'authorization']
CORS_ALLOW_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "core",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_celery_beat",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "core/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Ensure these are set correctly
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Optional: Add more detailed token settings
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# settings.py

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # Using Redis as broker
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'  # Redis as result backend
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE  
CELERY_ENABLE_UTC = USE_TZ   

CELERY_APP = 'backend.celery_app:app'

# Performance Optimizations
CELERY_WORKER_PREFETCH_MULTIPLIER = 4  # Balance between performance and fairness
CELERYD_MAX_TASKS_PER_CHILD = 100  # Prevent memory leaks
CELERYD_CONCURRENCY = 4  # Number of worker processes/threads

# Security Settings
CELERY_TASK_PROTOCOL = 2
CELERY_TASK_ALWAYS_EAGER = False  # Never run tasks locally in production
CELERY_TASK_IGNORE_RESULT = False  # Store results only when needed
CELERY_TASK_STORE_ERRORS_EVEN_IF_IGNORED = True

# Error Handling & Retries
CELERY_TASK_ACKS_LATE = True  # Better for long-running tasks
CELERY_TASK_REJECT_ON_WORKER_LOST = True
CELERY_TASK_SOFT_TIME_LIMIT = 300  # 5 minutes
CELERY_TASK_TIME_LIMIT = 360  # 6 minutes (must be > soft limit)
CELERY_TASK_MAX_RETRIES = 3
CELERY_TASK_RETRY_BACKOFF = True
CELERY_TASK_RETRY_BACKOFF_MAX = 700  # Seconds
CELERY_TASK_RETRY_DELAY = 60  # Initial retry delay

# Monitoring & Flower
CELERY_FLOWER_PORT = 5555
CELERY_FLOWER_BASIC_AUTH = ['admin:StrongPassword123!']

# Periodic Tasks (Celery Beat)
CELERY_BEAT_SCHEDULE = {
    'clean-expired-devices': {
        'task': 'devices.tasks.clean_expired_devices',
        'schedule': crontab(hour=3, minute=30),  # Daily at 3:30 AM
    },
    'generate-energy-reports': {
        'task': 'analytics.tasks.generate_daily_reports',
        'schedule': crontab(hour=4, minute=0, day_of_week=1),  # Weekly on Mondays 4 AM
    },
}

# Queue Routing
CELERY_TASK_DEFAULT_QUEUE = 'default'
CELERY_TASK_CREATE_MISSING_QUEUES = True
CELERY_TASK_ROUTES = {
    'devices.tasks.*': {'queue': 'devices'},
    'analytics.tasks.*': {'queue': 'analytics'},
    'notifications.tasks.*': {'queue': 'notifications'},
}

# Important: Add to bottom of settings.py
# Celery app configuration
CELERY_APP = 'your_project.celery:app'

AUTHENTICATION_BACKENDS = [
   'django.contrib.auth.backends.ModelBackend',
]

WSGI_APPLICATION = "backend.wsgi.application"

ADMIN_BASE_URL = 'https://your-admin-domain.com/admin/'
ADMINS = [('Zim-Rec Admin', 'admin@zim-rec.com')]
SERVER_EMAIL = 'server@zim-rec.com'
APP_NAME = 'Zim-Rec'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.yourprovider.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@zim-rec.com'
EMAIL_HOST_PASSWORD = 'your-email-password'
DEFAULT_FROM_EMAIL = 'Zim-Rec Platform <noreply@zim-rec.com>'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
