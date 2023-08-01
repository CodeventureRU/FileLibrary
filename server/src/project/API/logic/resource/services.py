import os

from API.models import Resource
from API.logic.file.services import create_file
from API.logic.group.services import create_group
from django.utils import timezone
from project import settings
from django.db.models import Q, Count, F


def image_processing(request, image):
    if image is not None:
        extension = image.name.split('.')[-1]
        image.name = f'{timezone.now().strftime("%d%m%y%f")}{request.user.pk}.{extension}'
        return image
    return None


def delete_image(resource):
    try:
        image = resource.image.path
        path = os.path.join(settings.MEDIA_ROOT, image)
        os.remove(path)
    except FileNotFoundError as ex:
        print('УДАЛЕНИЕ ФАЙЛА', ex)
        pass


def create_resource(request, data):
    if 'image' in data:
        data['image'] = image_processing(request, data['image'])
    resource = Resource.objects.create(**data)
    response = {'resource_id': resource.slug}
    if data['type'] == 'file':
        files = request.FILES.getlist('files')
        file = create_file(files, resource.pk)
        response.update({'file_id': file['id']})
    else:
        group = create_group(resource.pk)
        response.update({'group_id': group['id']})
    return response


def delete_resource(data, resource_instance):
    if data['image'] is not None:
        try:
            os.remove(os.path.join(settings.MEDIA_ROOT + '\\images', data['image'].split('/')[-1]))
        except FileNotFoundError as ex:
            print('УДАЛЕНИЕ ФАЙЛА', ex)
            pass

    if data['type'] == 'file':
        file = resource_instance.file
        file_name = file.file.name
        extensions = file.extensions.split()
        for extension in extensions:
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, file_name + '.' + extension))
            except FileNotFoundError as ex:
                print('УДАЛЕНИЕ ФАЙЛА', ex)
                pass


def resource_filtering(request, queryset):
    resource_type = request.GET.get('type', None)
    order_by = request.GET.get('order_by', 'created_at')
    order_direction = request.GET.get('order_direction', None)
    search = request.GET.get('search', None)

    queryset = queryset.prefetch_related('favorites')
    queryset = queryset.annotate(num_favorites=Count('favorites'))
    queryset = queryset.prefetch_related('file')
    queryset = queryset.annotate(downloads=F('file__downloads'))

    if resource_type:
        queryset = queryset.filter(type=resource_type)

    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) | Q(description__icontains=search) | Q(tags__icontains=search))

    if not order_direction or order_direction == 'desc':
        order_direction = '-'
    else:
        order_direction = ''

    if order_by == 'favorites':
        order_by = 'num_favorites'
    elif order_by == 'downloads':
        queryset = queryset.order_by('type', order_direction + order_by)
        return queryset

    queryset = queryset.order_by(order_direction + order_by)
    return queryset
