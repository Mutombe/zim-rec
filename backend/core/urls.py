from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomTokenObtainPairView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'devices', views.DeviceViewSet)
router.register(r'issue-requests', views.IssueRequestViewSet)
router.register(
    r'devices/(?P<device_pk>[^/.]+)/documents',
    views.DeviceDocumentViewSet,
    basename='devicedocument'
)

urlpatterns = [
    path('', include(router.urls)),
    path('fuel-options/', views.FuelOptionsView.as_view(), name='fuel-options'),
    path('technology-options/', views.TechnologyOptionsView.as_view(), name='technology-options'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
]