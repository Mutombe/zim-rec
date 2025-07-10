from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.conf import settings
from .models import Device, IssueRequest, Profile
from django.db import transaction
from django.contrib.auth.models import User  
import threading

ADMIN_EMAILS = ['admin@zim-rec.co.zw','simbamtombe@gmail.com','owen@silvercarbon.co.zw', 'shyline@africarbontraining.com', 'kuda@africarbontraining.com']

# Thread-local storage for tracking moderator actions
_thread_locals = threading.local()

def set_current_user(user):
    """Set the current user for the thread (usually called in middleware or views)"""
    _thread_locals.user = user

def get_current_user():
    """Get the current user for the thread"""
    return getattr(_thread_locals, 'user', None)

def send_admin_notification(subject, context, template_base):
    """Send notification to admins"""
    context.update({
        'admin_url': settings.ADMIN_BASE_URL,
        'app_name': getattr(settings, 'APP_NAME', 'Zim-REC'),
        'dashboard_url': getattr(settings, 'DASHBOARD_URL', '/dashboard/'),
        'moderator': get_current_user(),
        'action_date': timezone.now()
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

def send_user_notification(user, subject, context, template_base, attachments=None):
    """Send notification to user"""
    context.update({
        'app_name': getattr(settings, 'APP_NAME', 'Zim-REC'),
        'dashboard_url': getattr(settings, 'DASHBOARD_URL', '/dashboard/'),
        'moderator': get_current_user(),
        'action_date': timezone.now()
    })
    
    text_message = render_to_string(f'emails/user/{template_base}.txt', context)
    html_message = render_to_string(f'emails/user/{template_base}.html', context)
    
    # Create EmailMultiAlternatives object
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    
    # Attach files if provided
    if attachments:
        for attachment in attachments:
            email.attach_file(attachment)
    
    email.send(fail_silently=False)
# User registration signal
@receiver(post_save, sender=User)
def handle_new_user(sender, instance, created, **kwargs):
    if created:
        # Define attachment paths (modify these to your actual files)
        attachments = [
            settings.BASE_DIR / 'media/docs/ZIM-RECs Registration Process.pdf',
            settings.BASE_DIR / 'media/docs/Service Level Agreement- Silver Carbon.docx',
            settings.BASE_DIR / 'media/docs/ZIM-RECs Platform Guide.pdf',
            settings.BASE_DIR / 'media/docs/ZIMREC - MERITS.pdf'
        ]
        
        # Send user confirmation email with attachments
        send_status_email(instance, 'user', 'created', attachments=attachments)
        
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

def send_status_emaill(user, entity_type, status):
    subject = f"{entity_type.title()} Status Update"
    context = {
        'user': user,
        'entity_type': entity_type,
        'status': status,
        'app_name': 'Zim-Rec'
    }
    
    text_message = render_to_string(f'emails/user/{entity_type}_status_update.txt', context)
    html_message = render_to_string(f'emails/user/{entity_type}_status_update.html', context)
    
    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False
    )

def send_status_email(user, entity_type, status, attachments=None):
    subject = f"{entity_type.title()} Status Update"
    context = {
        'user': user,
        'entity_type': entity_type,
        'status': status,
        'app_name': 'Zim-Rec'
    }
    
    text_message = render_to_string(f'emails/user/{entity_type}_status_update.txt', context)
    html_message = render_to_string(f'emails/user/{entity_type}_status_update.html', context)
    
    # Create EmailMultiAlternatives object
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    
    # Attach files if provided
    if attachments:
        for attachment in attachments:
            email.attach_file(attachment)
    
    email.send(fail_silently=False)

@receiver(post_save, sender=Device)
def handle_device_changes(sender, instance, created, **kwargs):
    """Handle device creation and updates"""
    if created:
        # New device submission
        context = {
            'device': instance,
            'user': instance.user,
            'event_type': 'New Device Submission'
        }
        send_admin_notification(
            subject=f"New Device Submitted: {instance.device_name}",
            context=context,
            template_base='new_device'
        )
    else:
        # Check for status changes
        original = getattr(instance, '_original_device', None)
        if original and original.status != instance.status:
            # Status changed
            context = {
                'device': instance,
                'user': instance.user,
                'status': instance.status,
                'old_status': original.status,
                'new_status': instance.status
            }
            
            # Notify user
            send_user_notification(
                user=instance.user,
                subject=f"Device Status Update: {instance.device_name}",
                context=context,
                template_base='device_status_change'
            )
            
            # Notify admin
            context['event_type'] = 'Device Status Change'
            send_admin_notification(
                subject=f"Device Status Changed: {instance.device_name}",
                context=context,
                template_base='device_status_change'
            )
        
        # Check for other significant changes
        elif original:
            changes = []
            fields_to_check = ['device_name', 'fuel_type', 'technology_type', 'capacity']
            
            for field in fields_to_check:
                old_value = getattr(original, field, None)
                new_value = getattr(instance, field, None)
                if old_value != new_value:
                    changes.append(f"{field}: {old_value} → {new_value}")
            
            if changes:
                context = {
                    'device': instance,
                    'user': instance.user,
                    'changes': ', '.join(changes),
                    'event_type': 'Device Updated'
                }
                
                # Notify admin about device edit
                send_admin_notification(
                    subject=f"Device Edited: {instance.device_name}",
                    context=context,
                    template_base='device_edited'
                )

@receiver(post_save, sender=Device)
def handle_device_changess(sender, instance, created, **kwargs):
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

@receiver(post_delete, sender=Device)
def handle_device_deletion(sender, instance, **kwargs):
    """Handle device deletion"""
    context = {
        'device': instance,
        'user': instance.user,
        'event_type': 'Device Deleted',
        'reason': getattr(instance, '_deletion_reason', None)
    }
    
    # Notify user
    send_user_notification(
        user=instance.user,
        subject=f"Device Deleted: {instance.device_name}",
        context=context,
        template_base='device_deleted'
    )
    
    # Notify admin
    send_admin_notification(
        subject=f"Device Deleted: {instance.device_name}",
        context=context,
        template_base='device_deleted'
    )

@receiver(post_save, sender=Device)
def handle_device_status_change(sender, instance, **kwargs):
    if instance.status_changed:
        send_status_email(instance.user, 'device', instance.status)

@receiver(post_save, sender=IssueRequest)
def handle_issue_request_status_change(sender, instance, **kwargs):
    if instance.status_changed:
        send_status_email(instance.user, 'issue_request', instance.status)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Use transaction to ensure User is committed first
        transaction.on_commit(lambda: Profile.objects.create(user=instance))

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
