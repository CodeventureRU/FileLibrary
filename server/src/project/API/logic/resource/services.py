import os

from API.models import Resource
from API.logic.file.services import create_file
from API.logic.group.services import create_group
from django.utils import timezone
from project import settings


def create_resource(request, data):
    image = data['image']
    extension = image.name.split('.')[-1]
    image.name = f'{timezone.now().strftime("%d%m%y%f")}{request.user.pk}.{extension}'
    resource = Resource.objects.create(**data)
    response = {'resource_id': resource.id}

    if data['type'] == 'file':
        files = request.FILES.getlist('files')
        file = create_file(files, resource.pk)
        response.update({'file_id': file['id']})
    elif data['type'] == 'group':
        group = create_group(resource.pk)
        response.update({'group_id': group['id']})
    return response


def delete_resource_files(resource):
    os.remove(os.path.join(settings.MEDIA_ROOT, resource.image.name))
    file = resource.file
    file_name = file.file.name
    extensions = file.extensions.split()
    for extension in extensions:
        os.remove(os.path.join(settings.MEDIA_ROOT + '\\files', file_name + '.' + extension))
