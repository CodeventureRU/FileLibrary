from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from django.conf import settings
from django.views.decorators.csrf import csrf_protect

from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions


def enforce_csrf(request):
    def dummy_get_response():
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)


class JWTStatelessCookieAuthentication(JWTStatelessUserAuthentication):
    def user_can_authenticate(self, user):
        # Возвращаем True для разрешения аутентификации даже для неактивных пользователей
        return True

    def authenticate(self, request):
        header = self.get_header(request)

        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['ACCESS_COOKIE']) or None
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token


