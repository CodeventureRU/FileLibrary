from API.models import Resource
from rest_framework.response import Response
from rest_framework import status


def create_resource(data):
    resource = Resource.objects.create(**data)
    return Response(data={'id': resource.pk},
                    status=status.HTTP_200_OK)
