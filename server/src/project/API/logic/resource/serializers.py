from rest_framework import serializers
from django.db.models import Count, F

from API.logic.file.serializers import FileSerializer
from API.models import Resource, ResourceGroup, Favorite


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


class GroupResourceSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    num_favorites = serializers.IntegerField()
    downloads = serializers.IntegerField()
    resources = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'is_favorite',
                  'num_favorites', 'downloads', 'author', 'updated_at', 'created_at', 'resources']

    def get_resources(self, instance):
        group_instance = instance.groups
        resources_ids = ResourceGroup.objects.filter(group_id=group_instance.pk).values('resource_id').values_list(
            'resource_id', flat=True)
        queryset = Resource.objects.filter(pk__in=resources_ids, privacy_level='public')
        queryset = queryset.prefetch_related('favorites', 'file')
        queryset = queryset.annotate(num_favorites=Count('favorites'), downloads=F('file__downloads'))
        serializer = ListResourceSerializer(queryset, many=True, context=self.context)
        return serializer.data

    def get_is_favorite(self, instance):
        request = self.context.get("request")
        try:
            Favorite.objects.get(resource_id=instance.pk, user_id=request.user.id)
            return True
        except Exception:
            return False


class FileResourceSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    num_favorites = serializers.IntegerField()
    file = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['slug', 'name', 'description', 'image', 'privacy_level', 'tags', 'type', 'is_favorite',
                  'num_favorites', 'author', 'updated_at', 'created_at', 'file']

    def get_file(self, instance):
        file_instance = instance.file
        serializer = FileSerializer(file_instance, context=self.context)
        return serializer.data

    def get_is_favorite(self, instance):
        request = self.context.get("request")
        try:
            Favorite.objects.get(resource_id=instance.pk, user_id=request.user.id)
            return True
        except Exception:
            return False
