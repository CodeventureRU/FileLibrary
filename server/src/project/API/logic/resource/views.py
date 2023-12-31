from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django.core.exceptions import FieldError
from django.db.models import Count, F, Prefetch, Q
from django.http import HttpResponse
import mimetypes
import os

from API.logic.file.serializers import FileSerializer
from API.logic.group.serializers import GroupSerializer
from API.logic.resource.serializers import ListResourceSerializer, CUDResourceSerializer, FavoriteResourceSerializer
from API.permissions import IsAuthorAndActive
from API.logic.functions import get_data
from API.logic.resource.services import create_resource, delete_resource, resource_filtering, image_processing
from API.logic.file.services import add_new_files, delete_files
from API.models import Resource, ResourceGroup, Favorite, Group
from API.pagination import MyPaginationMixin
from rest_framework.settings import api_settings


class LCResourceView(APIView, MyPaginationMixin):
    serializer_class = ListResourceSerializer
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request):
        queryset = Resource.objects.filter(privacy_level='public')
        try:
            queryset = resource_filtering(request, queryset)
        except FieldError:
            return Response(data={'detail': 'Недопустимое имя фильтра'},
                            status=status.HTTP_400_BAD_REQUEST)
        queryset = self.paginate_queryset(queryset)
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    def post(self, request):
        data = get_data(request)
        if data['type'] == 'file' and request.FILES.get('files') is None:
            return Response(data={'detail': 'Не было прикреплено ни одного файла'},
                            status=status.HTTP_400_BAD_REQUEST)
        image = request.FILES.get('image')
        if image is not None:
            data['image'] = image
        data['author'] = request.user.pk
        serializer = CUDResourceSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            resource = create_resource(request, serializer.validated_data)
            return Response(data=resource,
                            status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RUDResourceView(APIView, MyPaginationMixin):
    serializer_class = CUDResourceSerializer
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthorAndActive()]

    def get(self, request, id):
        queryset = Resource.objects.filter(slug=id)
        queryset = queryset.prefetch_related('favorites', 'file', 'groups')
        queryset = queryset.annotate(num_favorites=Count('favorites'))
        queryset = queryset.annotate(downloads=F('file__downloads'))
        resource = queryset.first()

        if resource is None:
            return Response(data={'detail': 'Страница не найдена'},
                            status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if resource.privacy_level == 'private' and user != resource.author:
            raise PermissionDenied

        data = ListResourceSerializer(resource, context={'request': request}).data

        if resource.type == 'file':
            file_instance = resource.file
            file_instance = file_instance
            serializer = FileSerializer(file_instance, context={'request': request})
            data['file'] = serializer.data

        return Response(data=data,
                        status=status.HTTP_200_OK)

    def patch(self, request, id):
        # Getting resource instance and check permission #
        try:
            resource = Resource.objects.get(slug=id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'},
                            status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, resource)
        # Getting data and files from request #
        data = get_data(request)
        if 'image' in data and data['image'] == '':
            data['image'] = None
        image = request.FILES.get('image')
        if image is not None:
            data['image'] = image_processing(request, image)
        # Serializing data #
        serializer = self.serializer_class(resource, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Deleting image if image replaced or deleted #
        if 'image' in data and ((data['image'] is None) or (resource.image and 'image' in serializer.data)):
            resource.image.delete()
        # Setting new data in instance #
        for key, value in serializer.validated_data.items():
            setattr(resource, key, value)
        # Saving instance #
        resource.save(update_fields=list(serializer.validated_data.keys()).append('updated_at'))
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        # Getting resource instance and check permission #
        resource = Resource.objects.prefetch_related('file').filter(slug=id).first()
        if resource is None:
            return Response(data={'detail': 'Страница не найдена'}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request=request, obj=resource)
        # Deleting resource dependencies #
        try:
            delete_resource(resource)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # Deleting resource #
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupResourcesView(MyPaginationMixin, APIView):
    permission_classes = [AllowAny]
    serializer_class = ListResourceSerializer
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
    lookup_field = 'slug'

    def get(self, request, id):
        resource = Resource.objects.prefetch_related('groups').filter(slug=id).first()
        ids = ResourceGroup.objects.filter(group_id=resource.groups.pk).values_list('resource_id', flat=True)
        queryset = Resource.objects.filter(pk__in=ids, privacy_level__in=['public', 'link_only'])
        queryset = resource_filtering(request, queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


class UserResourcesView(MyPaginationMixin, APIView):
    serializer_class = ListResourceSerializer
    permission_classes = [AllowAny]
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def get(self, request, username):
        if username == request.user.username:
            queryset = Resource.objects.filter(author_id=request.user.id)
        else:
            queryset = Resource.objects.filter(author__username=username, privacy_level='public')

        try:
            queryset = resource_filtering(request, queryset)
        except FieldError:
            return Response(data={'detail': 'Недопустимое имя фильтра'},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset = self.paginate_queryset(queryset)
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


class ResourceFileView(APIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthorAndActive]
    lookup_field = 'slug'

    def post(self, request, id):
        try:
            resource = Resource.objects.prefetch_related('file').filter(slug=id).first()
            if resource is None:
                return Response(data={'detail': 'Страница не найдена'},
                                status=status.HTTP_404_NOT_FOUND)
            file_instance = resource.file
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'group', вместо 'file'"},
                            status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource)
        files = request.FILES.getlist('files')
        try:
            add_new_files(file_instance, files)
            resource.save(update_fields=['updated_at'])
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        try:
            resource = Resource.objects.prefetch_related('file').filter(slug=id).first()
            if resource is None:
                return Response(data={'detail': 'Страница не найдена'},
                                status=status.HTTP_404_NOT_FOUND)
            file_instance = resource.file
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'group', вместо 'file'"},
                            status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource)
        data = get_data(request)
        extensions = data['extensions']
        try:
            delete_files(file_instance, extensions)
            resource.save(update_fields=['updated_at'])
        except Exception as ex:
            print(ex)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceGroupView(APIView):
    serializer_class = CUDResourceSerializer
    permission_classes = [IsAuthorAndActive]
    lookup_field = 'slug'

    def post(self, request, resource_id, group_id):
        try:
            resource_file = Resource.objects.get(slug=resource_id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'}, status=status.HTTP_404_NOT_FOUND)
        if resource_file.type != 'file':
            return Response(data={'detail': 'Нельзя добавить группу в группу'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            resource_group = Resource.objects.prefetch_related('groups').filter(slug=group_id).first()
            if resource_group is None:
                return Response(data={'detail': 'Страница не найдена'}, status=status.HTTP_404_NOT_FOUND)
            group_instance = resource_group.groups
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'file', вместо 'group'"},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(ResourceGroup.objects.filter(group_id=group_instance.pk, resource_id=resource_file.pk)):
            return Response(data={'detail': 'Этот ресурс уже есть в группе'}, status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource_group)
        group_instance.resources.add(resource_file.pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, resource_id, group_id):
        try:
            resource_file = Resource.objects.get(slug=resource_id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'}, status=status.HTTP_404_NOT_FOUND)
        try:
            resource_group = Resource.objects.prefetch_related('groups').filter(slug=group_id).first()
            if resource_group is None:
                return Response(data={'detail': 'Страница не найдена'}, status=status.HTTP_404_NOT_FOUND)
            group_instance = resource_group.groups
        except Exception:
            return Response(data={'detail': "Был передан объект с типом 'file', вместо 'group'"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not len(ResourceGroup.objects.filter(group_id=group_instance.pk, resource_id=resource_file.pk)):
            return Response(data={'detail': 'Запрашиваемого ресурса нет в группе'}, status=status.HTTP_400_BAD_REQUEST)
        self.check_object_permissions(request=request, obj=resource_group)
        group_instance.resources.remove(resource_file.pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddingToFavoriteView(APIView):
    serializer_class = ListResourceSerializer
    permission_classes = [IsAuthorAndActive]

    def post(self, request, id):
        try:
            resource = Resource.objects.get(slug=id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'},
                            status=status.HTTP_404_NOT_FOUND)
        resource.favorites.add(request.user.id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, id):
        try:
            resource = Resource.objects.get(slug=id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'},
                            status=status.HTTP_404_NOT_FOUND)
        resource.favorites.remove(request.user.id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteResourcesView(MyPaginationMixin, APIView):
    serializer_class = FavoriteResourceSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def get(self, request):
        ids = Favorite.objects.filter(user_id=request.user.id).values_list('resource_id', flat=True)

        queryset = Resource.objects.filter(pk__in=ids)
        queryset = queryset.prefetch_related('favorites', 'file')
        queryset = queryset.annotate(num_favorites=Count('favorites'))
        queryset = queryset.annotate(downloads=F('file__downloads'))

        try:
            queryset = resource_filtering(request, queryset)
        except FieldError:
            return Response(data={'detail': 'Недопустимое имя фильтра'},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset = self.paginate_queryset(queryset)
        serializer = FavoriteResourceSerializer(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


class DownloadFileView(APIView):
    serializer_class = FileSerializer
    permission_classes = [AllowAny]

    def get(self, request, id, extension):
        try:
            resource = Resource.objects.prefetch_related('file').get(slug=id)
        except Resource.DoesNotExist:
            return Response(data={'detail': 'Страница не найдена'},
                            status=status.HTTP_404_NOT_FOUND)
        if resource.privacy_level == 'private' and resource.author != request.user:
            raise PermissionDenied
        file_instance = resource.file
        file_path = file_instance.file.path + f'.{extension}'
        if extension not in file_instance.extensions or not os.path.exists(file_path):
            return Response(data={'detail': 'Файл не найден'},
                            status=status.HTTP_404_NOT_FOUND)
        file_instance.downloads = file_instance.downloads + 1
        file_instance.save(update_fields=['downloads'])
        try:
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(),
                                        content_type=f"{mimetypes.guess_type(file_path)}",
                                        status=status.HTTP_200_OK)
                response['Content-Disposition'] = 'attachment; filename="{0}"'.format(
                    file_instance.file.name.split('/')[1] + f'.{extension}')
                return response
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IDontKnowHowToNameThisView(APIView):
    serializer = GroupSerializer
    permission_classes = [IsAuthorAndActive]

    def get(self, request, id):
        group_ids = Resource.objects.filter(author_id=request.user.id, type='group').values_list('id', flat=True)
        prefetch = Prefetch('resources', queryset=Resource.objects.filter(slug=id))
        queryset = Group.objects.prefetch_related(prefetch).filter(resource_id__in=group_ids)
        serializer = self.serializer(queryset, many=True, context={'request': request})
        for resource in serializer.data:
            if len(resource['resources']) != 0:
                resource.update({'is_added': True})
            else:
                resource.update({'is_added': False})
            resource.pop('resources')
        return Response(data=serializer.data,
                        status=status.HTTP_200_OK)
