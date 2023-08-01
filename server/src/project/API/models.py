from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from API.validators import UsernameValidator
from django.utils.functional import cached_property
from rest_framework_simplejwt.models import TokenUser
import uuid


class User(AbstractUser):
    email = models.EmailField(max_length=128, unique=True)
    username = models.CharField(max_length=32, unique=True, validators=[UsernameValidator])
    password = models.CharField(validators=[MinLengthValidator(8)], max_length=128)

    REQUIRED_FIELDS = ['email', 'password']

    def get_info(self):
        return {'username': self.username}


class Category(models.Model):
    name = models.CharField(max_length=32)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')


class Resource(models.Model):
    slug = models.SlugField(unique=True, default=uuid.uuid4)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256, blank=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    privacy_level = models.CharField(max_length=9, choices=[
        ('public', 'Все'),
        ('link_only', 'Люди по ссылке'),
        ('private', 'Только я')
    ], default='public')
    tags = models.TextField(blank=True)
    type = models.CharField(max_length=5, choices=[
        ('file', 'Файл'),
        ('group', 'Группа')
    ])
    favorites = models.ManyToManyField(User, through='Favorite')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)


class Group(models.Model):
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='groups')
    resources = models.ManyToManyField(Resource, through='ResourceGroup')


class File(models.Model):
    file = models.FileField(upload_to='files/')
    downloads = models.IntegerField(default=0)
    extensions = models.TextField()
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='file')


class ResourceCategory(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)


class ResourceGroup(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)


class CustomTokenUser(TokenUser):

    @cached_property
    def is_active(self):
        return self.token.get("is_active", False)
