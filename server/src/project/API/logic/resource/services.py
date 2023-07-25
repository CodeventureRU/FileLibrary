from API.models import Resource
from API.logic.file.services import create_file
from API.logic.group.services import create_group
from django.utils import timezone


def create_resource(request, data):
    data['image'].name = f'{timezone.now().strftime("%d%m%y%f")}{request.user.pk}'
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
