from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, NotAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.middleware import csrf
from django.contrib.auth import authenticate
from project import settings

from API.logic.functions import get_data
from API.logic.user.serializers import UserSerializer
from API.logic.user.services import register, activate, verify, set_cookies, delete_cookie, set_access_cookie, send_account_activation_message


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
        user_instance = authenticate(username=data['username'], password=data['password'])
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
            return Response(status=status.HTTP_204_NO_CONTENT)
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
                raise info
            raise NotAuthenticated


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response = delete_cookie(response)
        return response


class ResendEmailMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_instance = request.user
        if not user_instance.is_active:
            send_account_activation_message(request, user_instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(data={'detail': 'Ваш учётная запись уже активирована'}, status=status.HTTP_400_BAD_REQUEST)
