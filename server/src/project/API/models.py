from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from API.validators import UsernameValidator


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
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=32, blank=True)
    image = models.ImageField(blank=True)
    privacy_level = models.CharField(max_length=9, choices=[
        ('public', 'Все'),
        ('link_only', 'Люди по ссылке'),
        ('private', 'Только я')
    ], default='public')
    tags = models.TextField(blank=True)
    type = models.CharField(max_length=9, choices=[
        ('file', 'Файл'),
        ('group', 'Группа')
    ])
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Group(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)


class File(models.Model):
    file_path = models.FileField()
    downloads = models.IntegerField(default=0)
    extensions = models.TextField()
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='files')


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)


class ResourceCategory(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)


class ResourceGroup(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)