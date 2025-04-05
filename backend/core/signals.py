# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import Device, IssueRequest, User, Profile

ADMIN_EMAILS = ['admin@zim-rec.com']

def send_admin_notification(subject, context, template_base):

    context.update({
        'admin_url': settings.ADMIN_BASE_URL,
        'app_name': settings.APP_NAME
    })

    text_message = render_to_string(f'emails/admin/{template_base}.txt', context)
    html_message = render_to_string(f'emails/admin/{template_base}.html', context)
    
    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=ADMIN_EMAILS,
        html_message=html_message,
        fail_silently=False
    )

# User registration signal
@receiver(post_save, sender=User)
def handle_new_user(sender, instance, created, **kwargs):
    if created:
        # Send user confirmation email
        send_status_email(instance, 'user', 'created')
        
        # Send admin notification
        context = {
            'user': instance,
            'event_type': 'New User Registration',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject="New User Registration",
            context=context,
            template_base='new_user'
        )

def send_status_email(user, entity_type, status):
    subject = f"{entity_type.title()} Status Update"
    context = {
        'user': user,
        'entity_type': entity_type,
        'status': status,
        'app_name': 'Zim-Rec'
    }
    
    text_message = render_to_string(f'emails/{entity_type}_status_update.txt', context)
    html_message = render_to_string(f'emails/{entity_type}_status_update.html', context)
    
    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False
    )

@receiver(post_save, sender=Device)
def handle_device_changes(sender, instance, created, **kwargs):
    # Notify admin about new device submission
    if created:
        context = {
            'device': instance,
            'user': instance.user,
            'event_type': 'New Device Submission',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"New Device Submitted: {instance.device_name}",
            context=context,
            template_base='new_device'
        )
    
    # Status change notifications
    if hasattr(instance, 'status_changed') and instance.status_changed:
        send_status_email(instance.user, 'device', instance.status)
        
        # Notify admin about status change
        context = {
            'device': instance,
            'user': instance.user,
            'old_status': instance._original_status,
            'new_status': instance.status,
            'event_type': 'Device Status Change',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"Device Status Changed: {instance.device_name}",
            context=context,
            template_base='device_status_change'
        )

@receiver(post_save, sender=IssueRequest)
def handle_issue_request_changes(sender, instance, created, **kwargs):
    # Notify admin about new issue request
    if created:
        context = {
            'issue_request': instance,
            'user': instance.user,
            'event_type': 'New Issue Request',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"New Issue Request from {instance.user.email}",
            context=context,
            template_base='new_issue_request'
        )
    
    # Status change notifications
    if hasattr(instance, 'status_changed') and instance.status_changed:
        send_status_email(instance.user, 'issue_request', instance.status)
        
        # Notify admin about status change
        context = {
            'issue_request': instance,
            'user': instance.user,
            'old_status': instance._original_status,
            'new_status': instance.status,
            'event_type': 'Issue Request Status Change',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"Issue Request Status Changed: {instance.device.device_name}",
            context=context,
            template_base='issue_request_status_change'
        )

@receiver(post_save, sender=Device)
def handle_device_status_change(sender, instance, **kwargs):
    if instance.status_changed():
        send_status_email(instance.user, 'device', instance.status)

@receiver(post_save, sender=IssueRequest)
def handle_issue_request_status_change(sender, instance, **kwargs):
    if instance.status_changed():
        send_status_email(instance.user, 'issue_request', instance.status)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()