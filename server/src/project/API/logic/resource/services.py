from API.models import Resource
from rest_framework.response import Response
from rest_framework import status
from API.logic.file.services import create_file
from API.logic.group.services import create_group


def create_resource(request, data):
    resource = Resource.objects.create(**data)
    response = {'resource_id': resource.id}

    if data['type'] == 'file':
        files = request.FILES.getlist('files')
        file = create_file(files, resource.pk)
        response.update({'file_id': file.pk})
    elif data['type'] == 'group':
        group = create_group(resource.pk)
        response.update({'group_id': group.pk})
    return response
