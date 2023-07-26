from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from API.logic.resource.serializers import ResourceSerializer
from API.permissions import IsAuthorAndActive
from API.logic.functions import get_data
from API.logic.resource.services import create_resource, delete_resource_files
from API.logic.file.services import add_new_files, delete_files
from API.models import Resource


class LCResourceView(APIView):
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request):
        objects = Resource.objects.all()
        serializer = self.serializer_class(objects, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = get_data(request)
        data['image'] = request.FILES.get('image')
        data['author'] = request.user.pk
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        resource = create_resource(request, serializer.validated_data)
        return Response(data=resource,
                        status=status.HTTP_201_CREATED)


class RUDResourceView(APIView):
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request, id):
        resource = get_object_or_404(Resource, pk=id)
        serializer = self.serializer_class(resource, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        resource = get_object_or_404(Resource, pk=id)
        self.check_object_permissions(request, resource)
        data = get_data(request)
        serializer = self.serializer_class(resource, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        for key, value in serializer.validated_data.items():
            setattr(resource, key, value)
        resource.save(update_fields=list(serializer.validated_data.keys()))
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        resource = Resource.objects.prefetch_related('file').filter(pk=id)[0]
        if resource is None:
            return Response(data={'detail': 'Объекта с таким id не существует'}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request=request, obj=resource)
        delete_resource_files(resource)
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceFileView(APIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthorAndActive]

    def post(self, request, id):
        resource = Resource.objects.prefetch_related('file').filter(pk=id)[0]
        if resource is None:
            return Response(data={'detail': 'Объекта с таким id не существует'}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request=request, obj=resource)
        file_instance = resource.file
        files = request.FILES.getlist('files')
        add_new_files(file_instance, files)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        resource = Resource.objects.prefetch_related('file').filter(pk=id)[0]
        if resource is None:
            return Response(data={'detail': 'Объекта с таким id не существует'}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request=request, obj=resource)
        data = get_data(request)
        file_instance = resource.file
        extensions = data['extensions']
        delete_files(file_instance, extensions)
        return Response(status=status.HTTP_204_NO_CONTENT)