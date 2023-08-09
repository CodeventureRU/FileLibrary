from rest_framework import serializers

from API.models import Resource, Favorite


class ListResourceSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    is_favorite = serializers.SerializerMethodField()
    num_favorites = serializers.IntegerField()
    downloads = serializers.IntegerField()

    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'is_favorite',
                  'num_favorites', 'downloads', 'author', 'updated_at', 'created_at']
        extra_kwargs = {
            'image': {'required': False},
            'downloads': {'required': False},
        }

    def get_is_favorite(self, instance):
        request = self.context.get("request")
        try:
            Favorite.objects.get(resource_id=instance.pk, user_id=request.user.id)
            return True
        except Exception:
            return False


class CUDResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'author', 'updated_at',
                  'created_at']
        extra_kwargs = {
            'image': {'required': False},
        }


class FavoriteResourceSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    num_favorites = serializers.IntegerField()
    downloads = serializers.IntegerField()
    is_favorite = serializers.BooleanField(default=True)

    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'is_favorite', 'num_favorites',
                  'downloads', 'author', 'updated_at', 'created_at']
        extra_kwargs = {
            'image': {'required': False},
            'downloads': {'required': False},
            }
