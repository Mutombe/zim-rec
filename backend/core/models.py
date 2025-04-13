from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User  
from decimal import Decimal
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Device(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    FUEL_TECHNOLOGY_MAP = {
        'Solar': ['TC110', 'TC120', 'TC130', 'TC140', 'TC150'],
        'Wind': ['TC210', 'TC220'],
        'Hydro': ['TC310', 'TC320', 'TC330'],
        'Biomas': ['TC410', 'TC411', 'TC421', 'TC422', 'TC423', 'TC424', 'TC431', 'TC432', 'TC441', 'TC442', 'TC482'],
        'Geothermal': ['TC510', 'TC520', 'TC530'],
        'Municipal Waste': ['TC410', 'TC411', 'TC421', 'TC422', 'TC423', 'TC424', 'TC431', 'TC432', 'TC441', 'TC442'],
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # General Information
    device_name = models.CharField(max_length=255)
    issuer_organisation = models.CharField(max_length=255)
    default_account_code = models.CharField(max_length=255, blank=True, null=True)
    
    # Technical Information
    fuel_type = models.CharField(max_length=10)
    technology_type = models.CharField(max_length=10)
    capacity = models.DecimalField(
        max_digits=10, 
        decimal_places=6,
         validators=[MinValueValidator(Decimal('0.000001'))]
    )
    commissioning_date = models.DateField()
    effective_date = models.DateField()
    
    # Location Information
    address = models.TextField()
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(
        max_digits=9,  # 3 digits before + 6 after = 9 total
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal('-90.0')),
            MaxValueValidator(Decimal('90.0'))
        ]
    )
    
    longitude = models.DecimalField(
        max_digits=9,  # 3 digits before + 6 after = 9 total
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal('-180.0')),
            MaxValueValidator(Decimal('180.0'))
        ]
    )
    postcode = models.CharField(max_length=20, default='000000')
    
    # Audit Fields
    production_facility_registration = models.FileField(upload_to='device_documents/facility_registration/', null=True)
    declaration_of_ownership = models.FileField(upload_to='device_documents/ownership_declaration/', null=True)
    metering_evidence = models.FileField(upload_to='device_documents/metering_evidence/', null=True)
    single_line_diagram = models.FileField(upload_to='device_documents/single_line_diagram/', null=True)
    project_photos = models.FileField(upload_to='device_documents/project_photos/', null=True)
    additional_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    _original_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_status = self.status
        self.status_changed = False

    def save(self, *args, **kwargs):
        self.status_changed = self.status != self._original_status
        super().save(*args, **kwargs)
        self._original_status = self.status


    def clean(self):
        """Validate technology type against fuel type"""
        from django.core.exceptions import ValidationError
        if self.technology_type not in self.FUEL_TECHNOLOGY_MAP.get(self.fuel_type, []):
            raise ValidationError("Invalid technology for selected fuel type")
        


class DeviceDocument(models.Model):
    DOCUMENT_TYPES = [
        ('SF02', 'SF-02 Production Facility Registration'),
        ('SF02C', 'SF-02C Ownership Declaration'),
        ('METER', 'Metering Evidence'),
        ('DIAGRAM', 'Single Line Diagram'),
        ('PHOTOS', 'Project Photos'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='device_documents/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class IssueRequest(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='issue_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    period_of_production = models.CharField(max_length=255, blank=True)
    production_amount = models.DecimalField(max_digits=15, decimal_places=6)
    recipient_account = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    upload_file = models.FileField(upload_to='issue-requests/', null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    _original_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_status = self.status

    def save(self, *args, **kwargs):
        self.status_changed = self.status != self._original_status
        super().save(*args, **kwargs)
        self._original_status = self.status