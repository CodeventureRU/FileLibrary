from rest_framework.test import APITestCase
from rest_framework import status
from API.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from API.tokens import account_activation_token
import io
from PIL import Image
from API.models import File, Group
from django.shortcuts import get_object_or_404

# User test data
username = 'Test'
email = 'test@test.com'
password = 'test_password'

# Resource test data
name = 'test name'
description = 'test description'


class UserAuthenticationAPITest(APITestCase):
    def test_registration(self):
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

    def test_login_and_logout(self):
        login_url = '/api/v1/users/login/'
        logout_url = '/api/v1/users/logout/'
        data = {'username': username,
                'password': password}
        response = self.client.post(login_url, data)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.cookies), 3)
        self.assertEquals(len(response.data), 3)
        response = self.client.get(logout_url)
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)

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
        response = self.client.post(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_verification_without_access_token(self):
        url = '/api/v1/users/verification/'
        self.client.cookies.pop('access_token')
        response = self.client.post(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(self.client.cookies), 3)

    def test_verification_without_refresh_token(self):
        url = '/api/v1/users/verification/'
        self.client.cookies.pop('refresh_token')
        response = self.client.post(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(self.client.cookies), 2)

    def test_verification_without_anything(self):
        url = '/api/v1/users/verification/'
        self.client.cookies.clear()
        response = self.client.post(url)
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEquals(len(self.client.cookies), 1)


class CreateResourceAPITest(APITestCase):
    def setUp(self):
        url = '/api/v1/users/registration/'
        data = {'username': username,
                'email': email,
                'password': password,
                'confirm_password': password}
        self.client.post(path=url, data=data)

    def generate_test_image(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.seek(0)
        file.name = 'test.png'
        return file

    def generate_test_files(self):
        file_1 = open('test file.txt', 'w+')
        file_2 = open('test file.pdf', 'w+')
        return [file_1, file_2]

    def test_create_file_resource(self):
        url = '/api/v1/resources/'
        image = self.generate_test_image()
        files = self.generate_test_files()
        response = self.client.post(url, data={'name': name,
                                               'description': description,
                                               'type': 'file',
                                               'image': image,
                                               'files': files})
        try:
            file = get_object_or_404(File, pk=response.data['file_id'])
        except Exception:
            self.fail(msg='Объект File не был создан')
        extensions = file.extensions
        self.assertTrue('txt' in extensions)
        self.assertTrue('pdf' in extensions)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(len(response.data), 2)

    def test_create_group_resources(self):
        url = '/api/v1/resources/'
        image = self.generate_test_image()
        response = self.client.post(url, data={'name': name,
                                               'description': description,
                                               'type': 'group',
                                               'image': image})
        try:
            get_object_or_404(Group, pk=response.data['group_id'])
        except Exception:
            self.fail(msg='Объект Group не был создан')
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(len(response.data), 2)
