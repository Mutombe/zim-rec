from rest_framework import serializers
from .models import Device, DeviceDocument, IssueRequest, Profile, User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "company_name", "phone", "is_active", "is_staff", "is_superuser")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

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
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']

    def get_fuel_options(self, obj):
        return [
            {'value': 'ES100', 'label': 'Solar'},
            {'value': 'ES200', 'label': 'Wind'},
            {'value': 'ES300', 'label': 'Hydro'},
            {'value': 'ES400', 'label': 'Biomass'},
            {'value': 'ES500', 'label': 'Geothermal'},
        ]

    def get_technology_options(self, obj):
        return {
            # Solar (ES100)
            'ES100': [
                {'value': 'TC110', 'label': 'PV Ground mounted'},
                {'value': 'TC120', 'label': 'PV Roof Mounted (single installation)'},
                {'value': 'TC130', 'label': 'PV Floating'},
                {'value': 'TC140', 'label': 'PV Aggregated'},
                {'value': 'TC150', 'label': 'Solar Thermal Concentration'},
            ],
            # Wind (ES200)
            'ES200': [
                {'value': 'TC210', 'label': 'Onshore'},
                {'value': 'TC220', 'label': 'Offshore'},
            ],
            # Hydro (ES300)
            'ES300': [
                {'value': 'TC310', 'label': 'Dam'},
                {'value': 'TC320', 'label': 'Run of river'},
                {'value': 'TC330', 'label': 'Pumped Hydro Storage (Natural in-flow only)'},
            ],
            # Biomass (ES400)
            'ES400': [
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
            'ES500': [
                {'value': 'TC510', 'label': 'Dry Steam Plant'},
                {'value': 'TC520', 'label': 'Flash Steam Plant'},
                {'value': 'TC530', 'label': 'Binary Cycle Plant'},
            ],
            # Municipal Waste (E5510 - Special case)
            'E5510': [
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

    def validate(self, data):
        if data['effective_date'] < data['commissioning_date']:
            raise serializers.ValidationError("Effective date must be after commissioning date")
        return data

class IssueRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueRequest
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']