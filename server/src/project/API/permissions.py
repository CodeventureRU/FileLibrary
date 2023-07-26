from rest_framework import permissions


class IsAuthorAndActive(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_active:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user:
            return True
        return False
