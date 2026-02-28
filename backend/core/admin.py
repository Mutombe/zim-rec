# account/admin.py
from django.contrib import admin
from .models import User, Profile, Device, IssueRequest, NewsletterSubscriber

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

class AdminNewsletterSubscriberOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "subscribed_at",
        "is_active",
    )
    list_filter = ("is_active", "subscribed_at")
    search_fields = ("email",)
    ordering = ("-subscribed_at",)

admin.site.register(IssueRequest, AdminIssueRequestOverview)
admin.site.register(Profile, AdminProfileOverview)
admin.site.register(Device, AdminDeviceOverview)
admin.site.register(NewsletterSubscriber, AdminNewsletterSubscriberOverview)
