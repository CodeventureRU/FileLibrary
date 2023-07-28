from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework.authentication import CSRFCheck
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


def enforce_csrf(request):
    def dummy_get_response():
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        return reason


class JWTStatelessCSRFUserAuthentication(JWTStatelessUserAuthentication):

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token


def custom_user_authentication_rule(user):
    return user is not None


class EmailUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if '@' in username:
            kwargs = {'email': username}
        else:
            kwargs = {'username': username}
        try:
            user = UserModel.objects.get(**kwargs)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None