from API.models import Group


def create_group(resource_id):
    Group.objects.create(resource_id=resource_id)
