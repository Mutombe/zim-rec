# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Device, DeviceDocument, IssueRequest, Profile
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import DeviceSerializer, DeviceDocumentSerializer, IssueRequestSerializer, UserSerializer, ProfileSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsDeviceOwner

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)
            print("Username", user.username)
            return Response(
                {"detail": "You're now registered to Auto Eden"},
                status=status.HTTP_201_CREATED,
            )
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
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )
        
    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
        # Temporary fix until signals work
            profile = Profile.objects.create(user=request.user)
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
class FuelOptionsView(APIView):
    def get(self, request):
        return Response(DeviceSerializer().get_fuel_options(None))

class TechnologyOptionsView(APIView):
    def get(self, request):
        fuel_type = request.query_params.get('fuel_type')
        return Response({
            'options': Device.FUEL_TECHNOLOGY_MAP.get(fuel_type, [])
        })
    
class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated, IsDeviceOwner]
    queryset = Device.objects.all().select_related('user').prefetch_related('documents')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        device = self.get_object()
        if device.status != 'draft':
            return Response(
                {'error': 'Only draft devices can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        device.status = 'submitted'
        device.save()
        return Response({'status': 'submitted'})

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