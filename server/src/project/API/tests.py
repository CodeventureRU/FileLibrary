from rest_framework.test import APITestCase
from rest_framework import status
from API.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from API.tokens import account_activation_token

# Test data
username = 'Test'
email = 'test@test.com'
password = 'test_password'


class UserAuthenticationAPITest(APITestCase):
    def test_registration(self):
        # Testing registration
        url = '/api/v1/users/registration/'
        data = {'username': username,
                'email': email,
                'password': password,
                'confirm_password': password}
        response = self.client.post(url, data)
        self.assertEquals(len(response.cookies), 3)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(len(response.data), 3)


class UserLoginAndActivationAPITest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username=username, email=email, password=password, is_active=False)

    def test_login(self):
        url = '/api/v1/users/login/'
        data = {'username': username,
                'password': password}
        response = self.client.post(url, data)
        self.assertEquals(len(response.cookies), 3)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 3)

    def test_activation(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = account_activation_token.make_token(self.user)
        url = f'/api/v1/activation/{uid}/{token}/'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)


class UserVerifyAPITest(APITestCase):

    def setUp(self):
        url = '/api/v1/users/registration/'
        data = {'username': username,
                'email': email,
                'password': password,
                'confirm_password': password}
        self.response = self.client.post(url, data)

    def test_verification(self):
        url = '/api/v1/users/verification/'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_verification_without_access_token(self):
        url = '/api/v1/users/verification/'
        self.client.cookies.pop('access_token')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_verification_without_anything(self):
        url = '/api/v1/users/verification/'
        self.client.cookies.clear()
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)
