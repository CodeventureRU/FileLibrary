from API.models import File
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from project import settings
import os


def create_file(files, resource_id):
    extensions = ''
    file_name = f'{timezone.now().strftime("%d%m%y")}{len(files)}{resource_id}'
    for file in files:
        extension = file.name.split(".")[-1]
        file.name = f'{file_name}.{extension}'
        default_storage.save(f'{settings.MEDIA_ROOT}/files/{file.name}', ContentFile(file.read()))
        extensions += f'{extension} '
    file = File.objects.create(file='files/' + file_name, extensions=extensions, resource_id=resource_id)
    return {'id': file.pk}


def add_new_files(file_instance, files):
    extensions = ''
    file_name = file_instance.file.__str__()
    for file in files:
        extension = file.name.split(".")[-1]
        file.name = f'{file_name}.{extension}'
        default_storage.save(f'{settings.MEDIA_ROOT}/files/{file.name}', ContentFile(file.read()))
        extensions += f'{extension} '
    file_instance.extensions = file_instance.extensions + extensions
    file_instance.save()


def delete_files(file_instance, extensions):
    file_name = file_instance.file.__str__()
    new_extensions = file_instance.extensions
    for extension in extensions:
        os.remove(os.path.join(settings.MEDIA_ROOT + '\\files', file_name + '.' + extension))
        new_extensions = new_extensions.replace(extension, '')
    file_instance.extensions = new_extensions
    file_instance.save()