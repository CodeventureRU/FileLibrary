from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from django.middleware import csrf
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.contrib.auth.models import update_last_login
from project import settings

from API.logic.functions import get_data
from API.models import User, Resource
from API.logic.user.serializers import UserSerializer, RUDUserSerializer
from API.logic.user.services import register, activate, verify, set_cookies, delete_cookie, set_access_cookie, \
      reset_password, confirm_email, send_email_message
from API.logic.resource.services import delete_resource
from API.throttling import ResendEmailMessageThrottle


# Registration #
class RegistrationView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ResendEmailMessageThrottle]

    def initial(self, request, *args, **kwargs):
        self.format_kwarg = self.get_format_suffix(**kwargs)

        neg = self.perform_content_negotiation(request)
        request.accepted_renderer, request.accepted_media_type = neg

        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme

        self.perform_authentication(request)
        self.check_permissions(request)

    def post(self, request):
        data = get_data(request)
        if 'confirm_password' in data and data['password'] == data['confirm_password']:
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            self.check_throttles(request)
            try:
                user_instance = register(request, serializer.validated_data)
                response = Response(data={'username': user_instance.username,
                                          'email': user_instance.email,
                                          'is_active': user_instance.is_active},
                                    status=status.HTTP_201_CREATED)
                response = set_cookies(response, user_instance)
                update_last_login(self, user_instance)
            except Exception:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            csrf.get_token(request)
            return response
        else:
            raise ValidationError({'confirm_password': ['Поле пароль и подтверждение пароля не совпадают']})


# Resend account activation email message #
class ResendingEmailMessageView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ResendEmailMessageThrottle]

    def post(self, request):
        user_instance = request.user
        if not user_instance.is_active:
            send_email_message('account_activation', user_instance)
            return Response(
                data={'detail': 'Письмо с ссылкой для активации учётной записи было отправлено на почтовый адрес'},
                status=status.HTTP_200_OK)
        return Response(data={'detail': 'Ваша учётная запись уже активирована'}, status=status.HTTP_400_BAD_REQUEST)


# Account activation with link from email #
class AccountActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        if activate(uidb64, token):
            return Response(data={'detail': 'Ваша учётная запись успешно активирована'},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Неправильная ссылка или срок действия ссылки истёк'},
                            status=status.HTTP_400_BAD_REQUEST)


# Login #
class LoginView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = get_data(request)
        user_instance = authenticate(username=data['login'], password=data['password'])
        if user_instance is not None:
            response = Response(data={'username': user_instance.username,
                                      'email': user_instance.email,
                                      'is_active': user_instance.is_active},
                                status=status.HTTP_200_OK)
            response = set_cookies(response, user_instance)
            update_last_login(self, user_instance)
            csrf.get_token(request)
        else:
            return Response(data={'detail': 'Неправильный логин или пароль'},
                            status=status.HTTP_401_UNAUTHORIZED)
        return response


# User verification (refresh token (if needed) and return user data) #
class VerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_access_token = request.COOKIES.get(settings.SIMPLE_JWT['ACCESS_COOKIE'])
        raw_refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE'])
        is_verified, info, user_data = verify(request, raw_access_token, raw_refresh_token)
        csrf.get_token(request)

        if is_verified:
            response = Response(data=user_data, status=status.HTTP_200_OK)
            if info is not None:
                response = set_access_cookie(response, info)
                return response
            return response
        else:
            if info is not None:
                raise PermissionDenied(f'CSRF Failed: {info}')
            raise NotAuthenticated


# Update username or password #
class UpdatingDataView(APIView):
    serializer_class = RUDUserSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        data = get_data(request)
        try:
            user_instance = User.objects.get(pk=request.user.pk)
        except User.DoesNotExist:
            return Response(data={'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)

        if 'username' in data:
            setattr(user_instance, 'username', serializer.validated_data['username'])
            user_instance.save(update_fields=['username'])
            return Response(data={'detail': 'Имя пользователя успешно изменено'},
                            status=status.HTTP_200_OK)

        elif 'password' in data:
            password = serializer.validated_data['password']
            confirm_password = data['confirm_password']
            current_password = data['current_password']
            if user_instance.check_password(current_password):
                if current_password == password:
                    raise ValidationError({'password': 'Вас текущий пароль совпадает с новым паролем'})
                elif password == confirm_password:
                    user_instance.set_password(data['password'])
                    user_instance.save(update_fields=['password'])
                    return Response(data={'detail': 'Пароль успешно изменён'},
                                    status=status.HTTP_200_OK)
                else:
                    raise ValidationError({'confirm_password': ['Поле пароль и подтверждение пароля не совпадают']})
            else:
                raise ValidationError({'current_password': ['Неправильный пароль']})
        else:
            return Response(data={'detail': 'Вы не передали данных для изменения'},status=status.HTTP_400_BAD_REQUEST)


# Update email #
class UpdatingEmailView(APIView):
    serializer_class = RUDUserSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [ResendEmailMessageThrottle]

    def initial(self, request, *args, **kwargs):
        self.format_kwarg = self.get_format_suffix(**kwargs)

        neg = self.perform_content_negotiation(request)
        request.accepted_renderer, request.accepted_media_type = neg

        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme

        self.perform_authentication(request)
        self.check_permissions(request)

    def patch(self, request):
        data = get_data(request)
        try:
            user_instance = User.objects.get(pk=request.user.pk)
        except User.DoesNotExist:
            return Response(data={'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        self.check_throttles(request)
        send_email_message('email_confirmation', user_instance, serializer.validated_data['email'])
        return Response(
            data={'detail': 'Письмо с ссылкой для подтверждения смены почты было отправлено на новый почтовый адрес'},
            status=status.HTTP_200_OK)


# Account deletion #
class AccountDeletionView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        # Getting user instance #
        try:
            user_instance = User.objects.get(pk=request.user.pk)
        except User.DoesNotExist:
            return Response(data={'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # Getting resources, that was created by user and deleting them #
        resources = Resource.objects.filter(author_id=request.user.pk)
        for resource in resources:
            delete_resource(resource)
            resource.delete()
        # Deleting user instance #
        user_instance.delete()
        # Creating response with logout #
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response = delete_cookie(response)
        return response


# Confirm email change with link from email #
class EmailConfirmationView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, email64, token):
        data = get_data(request)
        user_instance = authenticate(username=data['login'], password=data['password'])
        if user_instance is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if confirm_email(user_instance, uidb64, email64, token):
            return Response(data={'detail': 'Ваш почта успешна изменена'},
                            status=status.HTTP_200_OK)
        elif confirm_email(user_instance, uidb64, email64, token) is None:
            return Response({'detail': 'Вы вошли не в тот аккаунт, у которого хотите поменять почту'},
                            status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Неправильная ссылка или срок действия ссылки истёк'},
                            status=status.HTTP_400_BAD_REQUEST)


# Send reset password email message #
class SendingResetPasswordMessageView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ResendEmailMessageThrottle]

    def initial(self, request, *args, **kwargs):
        self.format_kwarg = self.get_format_suffix(**kwargs)

        neg = self.perform_content_negotiation(request)
        request.accepted_renderer, request.accepted_media_type = neg

        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme

        self.perform_authentication(request)
        self.check_permissions(request)

    def post(self, request):
        data = get_data(request)
        login = data['login']
        try:
            validate_email(login)
            kwargs = {'email': login}
        except Exception:
            kwargs = {'username': login}
        try:
            user_instance = User.objects.filter(**kwargs)[0]
        except IndexError:
            return Response(data={'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.check_throttles(request)
        try:
            send_email_message('reset_password', user_instance)
            return Response(data={'detail': 'Письмо с ссылкой для сброса пароля было отправлено на почтовый адрес'},
                            status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Reset password with link from email #
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        data = get_data(request)
        if data['password'] == data['confirm_password']:
            if reset_password(data['password'], uidb64, token):
                return Response(data={'detail': 'Ваш пароль успешно изменён'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Неправильная ссылка или срок действия ссылки истёк'},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            raise ValidationError({'confirm_password': ['Поле пароль и подтверждение пароля не совпадают']})


# Logout #
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response = delete_cookie(response)
        return response
