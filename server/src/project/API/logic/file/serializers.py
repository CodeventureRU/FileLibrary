from rest_framework import serializers
from API.models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['file', 'downloads', 'extensions']
