from rest_framework import serializers
from .models import Device, DeviceDocument, IssueRequest, Profile
from django.contrib.auth.models import User  
from django.core.exceptions import ValidationError
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "is_active", "is_staff", "is_superuser")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", required=False)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["email", "created_at", "updated_at"]

    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop("user", None)
        if user_data and "username" in user_data:
            instance.user.username = user_data["username"]
            instance.user.save()

        # Update profile fields
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.profile_picture = validated_data.get(
            "profile_picture", instance.profile_picture
        )
        instance.save()

        return instance

class DeviceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDocument
        fields = ['id', 'document_type', 'file', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class DeviceSerializer(serializers.ModelSerializer):
    documents = DeviceDocumentSerializer(many=True, required=False)
    fuel_options = serializers.SerializerMethodField()
    technology_options = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_fuel_options(self, obj):
        return [
            {'value': 'Solar', 'label': 'Solar'},
            {'value': 'Wind', 'label': 'Wind'},
            {'value': 'Hydro', 'label': 'Hydro'},
            {'value': 'Biomass', 'label': 'Biomass'},
            {'value': 'Geothermal', 'label': 'Geothermal'},
        ]

    def get_technology_options(self, obj):
        return {
            # Solar (ES100)
            'Solar': [
                {'value': 'TC110', 'label': 'PV Ground mounted'},
                {'value': 'TC120', 'label': 'PV Roof Mounted (single installation)'},
                {'value': 'TC130', 'label': 'PV Floating'},
                {'value': 'TC140', 'label': 'PV Aggregated'},
                {'value': 'TC150', 'label': 'Solar Thermal Concentration'},
            ],
            # Wind (ES200)
            'Wind': [
                {'value': 'TC210', 'label': 'Onshore'},
                {'value': 'TC220', 'label': 'Offshore'},
            ],
            # Hydro (ES300)
            'Hydro': [
                {'value': 'TC310', 'label': 'Dam'},
                {'value': 'TC320', 'label': 'Run of river'},
                {'value': 'TC330', 'label': 'Pumped Hydro Storage (Natural in-flow only)'},
            ],
            # Biomass (ES400)
            'Biomass': [
                {'value': 'TC410', 'label': 'Combined cycle gas turbine with heat recovery: Non CHP'},
                {'value': 'TC411', 'label': 'Combined cycle gas turbine with heat recovery: CHP'},
                {'value': 'TC421', 'label': 'Steam turbine with back-pressure turbine (open cycle): Non CHP'},
                {'value': 'TC422', 'label': 'Steam turbine with back-pressure turbine (open cycle): CHP'},
                {'value': 'TC423', 'label': 'Steam turbine with condensation turbine (closed cycle): Non CHP'},
                {'value': 'TC424', 'label': 'Steam turbine with condensation turbine (closed cycle): CHP'},
                {'value': 'TC431', 'label': 'Gas turbine with heat recovery: Non CHP'},
                {'value': 'TC432', 'label': 'Gas turbine with heat recovery: CHP'},
                {'value': 'TC441', 'label': 'Internal combustion engine: Non CHP'},
                {'value': 'TC442', 'label': 'Internal combustion engine: CHP'},
                {'value': 'TC482', 'label': 'Steam engine: CHP'},
            ],
            # Geothermal (ES500)
            'Geothermal': [
                {'value': 'TC510', 'label': 'Dry Steam Plant'},
                {'value': 'TC520', 'label': 'Flash Steam Plant'},
                {'value': 'TC530', 'label': 'Binary Cycle Plant'},
            ],
            # Municipal Waste (E5510 - Special case)
            'Municipal Waste': [
                {'value': 'TC410', 'label': 'Combined cycle gas turbine with heat recovery: Non CHP'},
                {'value': 'TC411', 'label': 'Combined cycle gas turbine with heat recovery: CHP'},
                {'value': 'TC421', 'label': 'Steam turbine with back-pressure turbine (open cycle): Non CHP'},
                {'value': 'TC422', 'label': 'Steam turbine with back-pressure turbine (open cycle): CHP'},
                {'value': 'TC423', 'label': 'Steam turbine with condensation turbine (closed cycle): Non CHP'},
                {'value': 'TC424', 'label': 'Steam turbine with condensation turbine (closed cycle): CHP'},
                {'value': 'TC431', 'label': 'Gas turbine with heat recovery: Non CHP'},
                {'value': 'TC432', 'label': 'Gas turbine with heat recovery: CHP'},
                {'value': 'TC441', 'label': 'Internal combustion engine: Non CHP'},
                {'value': 'TC442', 'label': 'Internal combustion engine: CHP'},
            ]
        }
    
    def get_volume_evidence_options(self, obj):
        return [
            {'value': 'Metering', 'label': 'Metering data'},
            {'value': 'Invoice', 'label': 'Contract sales invoice'},
            {'value': 'Other', 'label': 'Other'},
        ]
        
    def get_funding_options(self, obj):
        return [
            {'value': 'No', 'label': 'No'},
            {'value': 'Investment', 'label': 'Investment'},
            {'value': 'Production', 'label': 'Production'},
        ]
        
    def get_yes_no_options(self, obj):
        return [
            {'value': 'Yes', 'label': 'Yes'},
            {'value': 'No', 'label': 'No'},
        ]

    def validate(self, data):
        data = super().validate(data)

        # Only validate dates if they're present in the update
        if 'effective_date' in data and 'commissioning_date' in data:
            if data['effective_date'] < data['commissioning_date']:
                raise serializers.ValidationError(
                    "Effective date must be after commissioning date"
                )
    
        # For partial updates, get existing dates from instance
        elif self.instance and 'effective_date' in data:
            if data['effective_date'] < self.instance.commissioning_date:
                raise serializers.ValidationError(
                    "Effective date must be after commissioning date"
                )
            
        if self.context['request'].user.is_superuser:
            if 'rejection_reason' in data:
                if data.get('status') != 'Rejected' and data['rejection_reason']:
                    raise serializers.ValidationError(
                        "Rejection reason can only be set when status is Rejected"
                    )
                
        # Check funding end date is provided if public funding is not 'No'
        if data.get('public_funding') in ['Investment', 'Production'] and not data.get('funding_end_date'):
            raise serializers.ValidationError({
                'funding_end_date': 'Funding end date is required when public funding is specified'
            })
            
        # Check details are provided for Yes choices
        if data.get('onsite_consumer') == 'Yes' and not data.get('onsite_consumer_details'):
            raise serializers.ValidationError({
                'onsite_consumer_details': 'Please provide details for on-site consumer'
            })
            
        if data.get('auxiliary_energy') == 'Yes' and not data.get('auxiliary_energy_details'):
            raise serializers.ValidationError({
                'auxiliary_energy_details': 'Please provide details for auxiliary energy sources'
            })
            
        return data
            
        return data
    
    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError as e:
            # Format validation errors properly
            raise serializers.ValidationError(e.detail)

    def validate_latitude(self, value):
        if value < Decimal('-90') or value > Decimal('90'):
            raise serializers.ValidationError(
                "Latitude must be between -90 and 90"
            )
        return value  # <-- Ensure this returns the value

    def validate_longitude(self, value):
        if value < Decimal('-180') or value > Decimal('180'):
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180"
            )
        return value  
        

class IssueRequestSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.device_name', read_only=True)
    
    class Meta:
        model = IssueRequest
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']

    def validate(self, data):
        data = super().validate(data)
        
        # Date validation
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date'
            })
            
        # Production amount validation
        if data['production_amount'] <= Decimal('0'):
            raise serializers.ValidationError({
                'production_amount': 'Production amount must be positive'
            })
            
        return data

    def create(self, validated_data):
        # Ensure device belongs to user
        device = validated_data['device']
        if device.user != self.context['request'].user:
            raise serializers.ValidationError({
                'device': 'You do not own this device'
            })
            
        return super().create(validated_data)