from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http.response import Http404

from API.logic.file.serializers import FileSerializer
from API.logic.resource.serializers import ResourceSerializer
from API.permissions import IsAuthorAndActive
from API.logic.functions import get_data
from API.logic.resource.services import create_resource, delete_resource
from API.logic.file.services import add_new_files, delete_files
from API.models import Resource, ResourceGroup


class LCResourceView(APIView):
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request):
        objects = Resource.objects.filter(privacy_level='public')
        serializer = self.serializer_class(objects, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = get_data(request)
        image = request.FILES.get('image')
        if image is not None:
            data['image'] = image
        data['author'] = request.user.pk
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            resource = create_resource(request, serializer.validated_data)
            return Response(data=resource,
                            status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RUDResourceView(APIView):
    serializer_class = ResourceSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request, id):
        resource = get_object_or_404(Resource, slug=id)
        serializer = self.serializer_class(resource, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        resource = get_object_or_404(Resource, slug=id)
        self.check_object_permissions(request, resource)
        data = get_data(request)
        serializer = self.serializer_class(resource, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        for key, value in serializer.validated_data.items():
            setattr(resource, key, value)
        resource.save(update_fields=list(serializer.validated_data.keys()))
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        try:
            resource = Resource.objects.prefetch_related('file').filter(slug=id)[0]
        except IndexError:
            raise Http404
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.check_object_permissions(request=request, obj=resource)
        serializer = self.serializer_class(resource)
        try:
            delete_resource(serializer.data, resource)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceFileView(APIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthorAndActive]
    lookup_field = 'slug'

    def post(self, request, id):
        try:
            resource = Resource.objects.prefetch_related('file').filter(slug=id)[0]
            file_instance = resource.file
        except IndexError:
            raise Http404
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'group', вместо 'file'"},
                            status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource)
        files = request.FILES.getlist('files')
        try:
            add_new_files(file_instance, files)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        try:
            resource = Resource.objects.prefetch_related('file').filter(slug=id)[0]
            file_instance = resource.file
        except IndexError:
            raise Http404
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'group', вместо 'file'"},
                            status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource)
        data = get_data(request)
        extensions = data['extensions']
        try:
            delete_files(file_instance, extensions)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceGroupView(APIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthorAndActive]
    lookup_field = 'slug'

    def post(self, request, resource_id, group_id):
        resource_file = get_object_or_404(Resource, slug=resource_id)
        if resource_file.type != 'file':
            return Response(data={'detail': 'Нельзя добавить группу в группу'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            resource_with_group = Resource.objects.prefetch_related('groups').filter(slug=group_id)[0]
            group_instance = resource_with_group.groups
        except IndexError:
            raise Http404
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'file', вместо 'group'"},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(ResourceGroup.objects.filter(group_id=group_id, resource_id=resource_id)):
            return Response(data={'detail': 'Этот ресурс уже есть в группе'}, status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource_with_group)
        group_instance.resources.add(resource_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, resource_id, group_id):
        get_object_or_404(Resource, slug=resource_id)
        try:
            resource_with_group = Resource.objects.prefetch_related('groups').filter(slug=group_id)[0]
            group_instance = resource_with_group.groups
        except IndexError:
            raise Http404
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'file', вместо 'group'"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not len(ResourceGroup.objects.filter(group_id=group_id, resource_id=resource_id)):
            return Response(data={'detail': 'Запрашиваемого ресурса нет в группе'}, status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource_with_group)
        group_instance.resources.remove(resource_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
