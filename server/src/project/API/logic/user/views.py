from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.middleware import csrf
from django.contrib.auth import authenticate

from API.logic.functions import get_data
from API.logic.user.serializers import UserSerializer
from API.logic.user.services import register, login, activate


class UserRegisterView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = get_data(request)
        if 'confirm_password' in data and data['password'] == data['confirm_password']:
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            response = register(request, serializer.validated_data)
            return response
        else:
            raise ValidationError({'confirm_password': ['Поле пароль и подтверждение пароля не совпадают']})


class UserLoginView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = get_data(request)
        user = authenticate(username=data['username'], password=data['password'])
        response = login(user)
        csrf.get_token(request)
        return response


class AccountActivateView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        response = activate(uidb64, token)
        return response
