# tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model

class RegistrationTest(TestCase):
    def test_user_profile_creation(self):
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        # Create user
        response = self.client.post('/register/', user_data)
        self.assertEqual(response.status_code, 201)
        
        # Verify profile exists
        user = get_user_model().objects.get(username='testuser')
        self.assertTrue(hasattr(user, 'profile'))