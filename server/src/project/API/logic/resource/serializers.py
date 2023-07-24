from rest_framework import serializers
from API.models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Resource
        fields = ['id', 'name', 'description', 'image', 'image_url', 'privacy_level', 'tags', 'type', 'author',
                  'updated_at', 'created_at']
        extra_kwargs = {
            'image': {'write_only': True},
            'image_url': {'read_only': True}
        }

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            print(self.context.items())
            return request.build_absolute_uri(obj.image.url)
        return None
