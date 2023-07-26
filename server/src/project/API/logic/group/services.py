from API.models import Group


def create_group(resource_id):
    group = Group.objects.create(resource_id=resource_id)
    return {'id': group.pk}