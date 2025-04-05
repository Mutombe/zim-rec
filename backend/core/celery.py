# tasks.py (Celery)
from celery import shared_task
from .signals import send_status_email

@shared_task
def async_send_status_email(user_id, entity_type, status):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    send_status_email(user, entity_type, status)

# Update signals.py to use Celery
def send_status_email(user, entity_type, status):
    async_send_status_email.delay(user.id, entity_type, status)