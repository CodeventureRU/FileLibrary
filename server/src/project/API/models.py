from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinLengthValidator


class User(AbstractUser):
    email = models.EmailField(max_length=128, unique=True)
    username = models.CharField(max_length=32, unique=True)
    password = models.CharField(validators=[MinLengthValidator(8)], max_length=128)

    REQUIRED_FIELDS = ['email', 'password']

    def get_info(self):
        return {'username': self.username}


class Group(models.Model):
    name = models.CharField(max_length=64)


class Category(models.Model):
    name = models.CharField(max_length=32)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')


class Meta(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=32)
    image = models.ImageField(blank=True)
    privacy_level = models.CharField(max_length=9, choices=[
        ('public', 'Все'),
        ('link_only', 'Люди по ссылке'),
        ('private', 'Только я')
    ])
    tags = models.TextField()
    type = models.CharField(max_length=9, choices=[
        ('file', 'Файл'),
        ('group', 'Группа')
    ])
    user = models.ManyToManyField(User, db_table='Meta_User')
    group = models.ManyToManyField(Group, db_table='Meta_Group')
    category = models.ManyToManyField(Category, db_table='Meta_Category')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class File(models.Model):
    file_path = models.FileField()
    downloads = models.IntegerField()
    extensions = models.TextField()
    meta = models.OneToOneField(Meta, on_delete=models.CASCADE, related_name='files')
