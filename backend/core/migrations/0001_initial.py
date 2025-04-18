# Generated by Django 5.1.7 on 2025-04-07 19:19

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Device",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("draft", "Draft"),
                            ("submitted", "Submitted"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="draft",
                        max_length=20,
                    ),
                ),
                ("device_name", models.CharField(max_length=255)),
                ("issuer_organisation", models.CharField(max_length=255)),
                (
                    "default_account_code",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("fuel_type", models.CharField(max_length=10)),
                ("technology_type", models.CharField(max_length=10)),
                (
                    "capacity",
                    models.DecimalField(
                        decimal_places=6,
                        max_digits=10,
                        validators=[django.core.validators.MinValueValidator(1e-06)],
                    ),
                ),
                ("commissioning_date", models.DateField()),
                ("effective_date", models.DateField()),
                ("address", models.TextField()),
                ("country", models.CharField(max_length=100)),
                ("latitude", models.DecimalField(decimal_places=6, max_digits=9)),
                ("longitude", models.DecimalField(decimal_places=6, max_digits=9)),
                ("postcode", models.CharField(default="000000", max_length=20)),
                (
                    "production_facility_registration",
                    models.FileField(
                        null=True, upload_to="device_documents/facility_registration/"
                    ),
                ),
                (
                    "declaration_of_ownership",
                    models.FileField(
                        null=True, upload_to="device_documents/ownership_declaration/"
                    ),
                ),
                (
                    "metering_evidence",
                    models.FileField(
                        null=True, upload_to="device_documents/metering_evidence/"
                    ),
                ),
                (
                    "single_line_diagram",
                    models.FileField(
                        null=True, upload_to="device_documents/single_line_diagram/"
                    ),
                ),
                (
                    "project_photos",
                    models.FileField(
                        null=True, upload_to="device_documents/project_photos/"
                    ),
                ),
                ("additional_notes", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="devices",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DeviceDocument",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "document_type",
                    models.CharField(
                        choices=[
                            ("SF02", "SF-02 Production Facility Registration"),
                            ("SF02C", "SF-02C Ownership Declaration"),
                            ("METER", "Metering Evidence"),
                            ("DIAGRAM", "Single Line Diagram"),
                            ("PHOTOS", "Project Photos"),
                        ],
                        max_length=10,
                    ),
                ),
                ("file", models.FileField(upload_to="device_documents/%Y/%m/%d/")),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
                (
                    "device",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="documents",
                        to="core.device",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="IssueRequest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("draft", "Draft"),
                            ("submitted", "Submitted"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="draft",
                        max_length=20,
                    ),
                ),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                (
                    "production_amount",
                    models.DecimalField(decimal_places=6, max_digits=15),
                ),
                ("recipient_account", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "device",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="issue_requests",
                        to="core.device",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(blank=True, max_length=100)),
                ("last_name", models.CharField(blank=True, max_length=100)),
                (
                    "profile_picture",
                    models.ImageField(
                        blank=True, null=True, upload_to="profile_pictures/"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
