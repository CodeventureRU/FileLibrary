from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from rest_framework.decorators import api_view

from API.tokens import account_activation_token
from API.models import User


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def register(request, validated_data):
    user = User.objects.create_user(username=validated_data['username'],
                                    email=validated_data['email'],
                                    password=validated_data['password'],
                                    is_active=False)
    current_site = get_current_site(request)
    mail_subject = 'Активация учётной записи'
    message = render_to_string('account_activation.html', {'username': user.username,
                                                           'domain': current_site.domain,
                                                           'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                                           'token': account_activation_token.make_token(user)})
    to_email = user.email
    email = EmailMessage(subject=mail_subject, body=message, to=[to_email])
    email.send()
    response = Response(data={'success': True}, status=status.HTTP_201_CREATED)
    return response


def get_response_with_cookies(user_instance):
    tokens = get_tokens_for_user(user_instance)
    response = Response(data={'success': True}, status=status.HTTP_200_OK)
    response.set_cookie(
        key=settings.SIMPLE_JWT['ACCESS_COOKIE'],
        value=tokens['access'],
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    response.set_cookie(
        key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
        value=tokens['refresh'],
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    return response


def login(user_instance):
    if user_instance is not None:
        if user_instance.is_active:
            response = get_response_with_cookies(user_instance)
            return response
        else:
            return Response(data={'success': False,
                                  'detail': 'Вы еще не активировали аккаунт с помощью сообщения на почте'},
                            status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(data={'success': False,
                              'detail': 'Неправильный логин или пароль'},
                        status=status.HTTP_401_UNAUTHORIZED)


def activate(uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'success': True}, status=status.HTTP_200_OK)
    else:
        return Response({'success': False, 'detail': 'Неправильная ссылка или срок действия ссылки истёк'}, status=status.HTTP_400_BAD_REQUEST)