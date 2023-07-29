from rest_framework import serializers
from API.models import Resource


class ResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'author',
                  'updated_at', 'created_at']
        extra_kwargs = {
            'image': {'required': False},
            'image_url': {'read_only': True, 'required': False}
        }
