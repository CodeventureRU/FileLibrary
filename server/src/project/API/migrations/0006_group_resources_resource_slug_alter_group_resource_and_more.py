# Generated by Django 4.2.3 on 2023-07-27 13:38

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_alter_group_resource'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='resources',
            field=models.ManyToManyField(through='API.ResourceGroup', to='API.resource'),
        ),
        migrations.AddField(
            model_name='resource',
            name='slug',
            field=models.SlugField(default=uuid.uuid4, unique=True),
        ),
        migrations.AlterField(
            model_name='group',
            name='resource',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='groups', to='API.resource'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
