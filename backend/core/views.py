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