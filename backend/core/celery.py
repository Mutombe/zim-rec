from celery import shared_task


@shared_task
def async_send_status_email(user_id, entity_type, status):
    from django.contrib.auth.models import User
    from .signals import send_status_email
    user = User.objects.get(pk=user_id)
    send_status_email(user, entity_type, status)
