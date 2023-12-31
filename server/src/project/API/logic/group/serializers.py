from rest_framework import serializers
from API.models import Group


class GroupSerializer(serializers.ModelSerializer):
    resource_id = serializers.CharField(source='resource.slug')
    name = serializers.CharField(source='resource.name')

    class Meta:
        model = Group
        fields = ['resource_id', 'resources', 'name']
