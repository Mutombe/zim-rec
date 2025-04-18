# account/admin.py
from django.contrib import admin
from .models import User, Profile, Device, IssueRequest

class AdminIssueRequestOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "device",
        "status",
        "user",
    )
    search_fields = ("user",)

class AdminProfileOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "profile_picture",
        "user",
    )
    search_fields = ("user",)

class AdminDeviceOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "device_name",
        "address",
    )
    search_fields = ("username",)

admin.site.register(IssueRequest, AdminIssueRequestOverview)
admin.site.register(Profile, AdminProfileOverview)
admin.site.register(Device, AdminDeviceOverview)
