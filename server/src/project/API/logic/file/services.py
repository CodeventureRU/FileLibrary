from API.models import File
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from project import settings


def create_file(files, resource_id):
    extensions = ''
    file_name = f'{timezone.now().strftime("%d%m%y")}{len(files)}{resource_id}'
    for file in files:
        extension = file.name.split(".")[-1]
        file.name = f'{file_name}.{extension}'
        default_storage.save(f'{settings.MEDIA_ROOT}/files/{file.name}', ContentFile(file.read()))
        extensions += f'{extension} '
    file = File.objects.create(file=file_name, extensions=extensions, resource_id=resource_id)
    return {'id': file.pk}
