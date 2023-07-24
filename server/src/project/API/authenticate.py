from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.conf import settings


def enforce_csrf(request):
    def dummy_get_response():
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        return reason



class JWTStatelessCookieAuthentication(JWTStatelessUserAuthentication):

    def authenticate(self, request):
        raw_access_token = request.COOKIES.get(settings.SIMPLE_JWT['ACCESS_COOKIE']) or None
        raw_refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE']) or None
        raw_csrf_token = request.COOKIES.get('csrftoken')

        if raw_csrf_token is None:
            return None

        elif raw_csrf_token is not None or raw_access_token is not None or raw_refresh_token is not None:
            reason = enforce_csrf(request)
            if reason is not None:
                raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

        if raw_access_token is None or raw_refresh_token is None:
            return None
        elif raw_access_token is not None or raw_refresh_token is not None:
            pass

        validated_token = self.get_validated_token(raw_access_token)
        return self.get_user(validated_token), validated_token


def custom_user_authentication_rule(user):
    return user is not None
