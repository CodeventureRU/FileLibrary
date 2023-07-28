from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from django.middleware import csrf
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.shortcuts import get_object_or_404
from project import settings

from API.logic.functions import get_data
from API.models import User
from API.logic.user.serializers import UserSerializer
from API.logic.user.services import register, activate, verify, set_cookies, delete_cookie, set_access_cookie, \
    send_account_activation_message, send_reset_password_message, reset_password
from API.throttling import ResendEmailMessageThrottle


class UserRegisterView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = get_data(request)
        if 'confirm_password' in data and data['password'] == data['confirm_password']:
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            try:
                user_instance = register(request, serializer.validated_data)
                response = Response(data={'username': user_instance.username,
                                          'email': user_instance.email,
                                          'is_active': user_instance.is_active},
                                    status=status.HTTP_201_CREATED)
                response = set_cookies(response, user_instance)
            except Exception:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            csrf.get_token(request)
            return response
        else:
            raise ValidationError({'confirm_password': ['Поле пароль и подтверждение пароля не совпадают']})


class UserLoginView(APIView):
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
            csrf.get_token(request)
        else:
            return Response(data={'detail': 'Неправильный логин или пароль'},
                            status=status.HTTP_401_UNAUTHORIZED)
        return response


class AccountActivateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        if activate(uidb64, token):
            return Response(data={'detail': 'Ваша учётная запись успешно активирована'},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Неправильная ссылка или срок действия ссылки истёк'},
                            status=status.HTTP_400_BAD_REQUEST)


class UserVerificationView(APIView):
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


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response = delete_cookie(response)
        return response


class ResendEmailMessageView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ResendEmailMessageThrottle]

    def post(self, request):
        user_instance = request.user
        if not user_instance.is_active:
            send_account_activation_message(request, user_instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(data={'detail': 'Ваша учётная запись уже активирована'}, status=status.HTTP_400_BAD_REQUEST)


class SendResetPasswordMessageView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ResendEmailMessageThrottle]

    def post(self, request):
        data = get_data(request)
        login = data['login']
        try:
            validate_email(login)
            kwargs = {'email': login}
        except Exception:
            kwargs = {'username': login}
        user_instance = get_object_or_404(User, **kwargs)
        try:
            send_reset_password_message(request, user_instance)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_204_NO_CONTENT)
