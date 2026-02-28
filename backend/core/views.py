from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Device, DeviceDocument, IssueRequest, Profile
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import DeviceSerializer, DeviceDocumentSerializer, IssueRequestSerializer, UserSerializer, ProfileSerializer, NewsletterSubscriberSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsDeviceOwner
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer, ContactSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import NewsletterSubscriber

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save(is_active=True)
                    # Let the signal handle profile creation
                    
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "detail": "Registration successful",
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": UserSerializer(user).data
                    }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        user_serializer = UserSerializer(user)
        
        data['user'] = user_serializer.data
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class ProfileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FuelOptionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(DeviceSerializer().get_fuel_options(None))

class TechnologyOptionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        fuel_type = request.query_params.get('fuel_type')
        tech_options = DeviceSerializer().get_technology_options(None).get(fuel_type, [])
        return Response({'options': tech_options})
    
class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated, IsDeviceOwner]
    queryset = Device.objects.all().select_related('user').prefetch_related('documents')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        device = self.get_object()
        device.status = 'Submitted'
        device.save()
        return Response({'status': 'Submitted'})
    
    def partial_update(self, request, *args, **kwargs):
        # Handle admin status override
        if request.user.is_superuser and 'status' in request.data:
            instance = self.get_object()
            instance.status = request.data['status']
            
            # Handle rejection reason
            if 'rejection_reason' in request.data:
                instance.rejection_reason = request.data['rejection_reason']
            
            instance.save()
            return Response(self.get_serializer(instance).data)
            
        return super().partial_update(request, *args, **kwargs)

class DeviceDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceDocumentSerializer
    permission_classes = [IsAuthenticated, IsDeviceOwner]
    queryset = DeviceDocument.objects.all()

    def perform_create(self, serializer):
        device = Device.objects.get(pk=self.kwargs['device_pk'])
        serializer.save(device=device)

class IssueRequestViewSet(viewsets.ModelViewSet):
    serializer_class = IssueRequestSerializer
    permission_classes = [IsAuthenticated, IsDeviceOwner]
    queryset = IssueRequest.objects.all().select_related('user', 'device')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        issue_request = self.get_object()
        if issue_request.status != 'draft':
            return Response(
                {'error': 'Only draft issue requests can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        issue_request.status = 'submitted'
        issue_request.save()
        return Response({'status': 'submitted'})


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response(
                {'detail': 'Google credential is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
        except ValueError:
            return Response(
                {'detail': 'Invalid Google token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = idinfo.get('email')
        given_name = idinfo.get('given_name', '')
        family_name = idinfo.get('family_name', '')

        if not email:
            return Response(
                {'detail': 'Email not provided by Google.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Generate username from email prefix, ensure uniqueness
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
            )
            user.set_unusable_password()
            user.save()

        # Update profile first/last name if empty
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=user)

        if not profile.first_name and given_name:
            profile.first_name = given_name
        if not profile.last_name and family_name:
            profile.last_name = family_name
        profile.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if serializer.is_valid():
            subscriber = serializer.save()

            # Send confirmation email
            try:
                send_mail(
                    subject='Welcome to the Zim-REC Newsletter!',
                    message=(
                        f'Thank you for subscribing to the Zim-REC newsletter!\n\n'
                        f'You will now receive updates on renewable energy projects '
                        f'and REC trading opportunities in Zimbabwe.\n\n'
                        f'Best regards,\nThe Zim-REC Team'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[subscriber.email],
                    html_message=(
                        f'<h2>Welcome to Zim-REC!</h2>'
                        f'<p>Thank you for subscribing to the Zim-REC newsletter.</p>'
                        f'<p>You will now receive updates on:</p>'
                        f'<ul>'
                        f'<li>Renewable energy projects in Zimbabwe</li>'
                        f'<li>REC trading opportunities</li>'
                        f'<li>Policy updates and industry news</li>'
                        f'</ul>'
                        f'<p>Best regards,<br>The Zim-REC Team</p>'
                    ),
                    fail_silently=True,
                )
            except Exception:
                pass  # Don't fail the subscription if email fails

            return Response(
                {'detail': 'Successfully subscribed to the newsletter!'},
                status=status.HTTP_201_CREATED
            )

        # Handle duplicate email gracefully
        if 'email' in serializer.errors:
            error_messages = serializer.errors['email']
            for msg in error_messages:
                if 'already exists' in str(msg).lower() or 'unique' in str(msg).lower():
                    # Check if they unsubscribed and resubscribe them
                    try:
                        existing = NewsletterSubscriber.objects.get(email=request.data.get('email'))
                        if not existing.is_active:
                            existing.is_active = True
                            existing.save()
                            return Response(
                                {'detail': 'Welcome back! You have been re-subscribed.'},
                                status=status.HTTP_200_OK
                            )
                    except NewsletterSubscriber.DoesNotExist:
                        pass
                    return Response(
                        {'detail': 'This email is already subscribed.'},
                        status=status.HTTP_200_OK
                    )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        response_msg = {"detail": "If an account with that email exists, a reset link has been sent."}

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(response_msg, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}"

        html_message = render_to_string('emails/user/password_reset.html', {
            'user': user,
            'reset_link': reset_link,
            'app_name': getattr(settings, 'APP_NAME', 'Zim-Rec'),
        })

        send_mail(
            subject='Reset Your Password - Zim-Rec',
            message=f'Click the following link to reset your password: {reset_link}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=True,
        )

        return Response(response_msg, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response(
                {"detail": "Reset link has expired or is invalid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )


class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        subject = serializer.validated_data.get('subject', '') or 'No Subject'
        message = serializer.validated_data['message']

        admin_email = 'admin@zim-rec.co.zw'
        app_name = getattr(settings, 'APP_NAME', 'Zim-Rec')

        full_subject = f"[{app_name} Contact] {subject}"

        plain_message = (
            f"New contact form submission\n\n"
            f"From: {name} ({email})\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}"
        )

        html_message = (
            f'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">'
            f'<div style="background-color: #059669; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">'
            f'<h2 style="color: white; margin: 0;">{app_name} - New Contact Message</h2>'
            f'</div>'
            f'<div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">'
            f'<p style="color: #374151;"><strong>From:</strong> {name}</p>'
            f'<p style="color: #374151;"><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>'
            f'<p style="color: #374151;"><strong>Subject:</strong> {subject}</p>'
            f'<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">'
            f'<p style="color: #374151;"><strong>Message:</strong></p>'
            f'<p style="color: #4b5563; white-space: pre-wrap;">{message}</p>'
            f'</div>'
            f'</div>'
        )

        try:
            send_mail(
                subject=full_subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception:
            return Response(
                {"detail": "Failed to send message. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"detail": "Your message has been sent successfully!"},
            status=status.HTTP_200_OK
        )