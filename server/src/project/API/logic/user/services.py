from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage

from API.tokens import account_activation_token
from API.models import User
from API.authenticate import enforce_csrf


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh.payload.update({'username': user.username,
                            'email': user.email,
                            'is_active': user.is_active})
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def set_access_cookie(response, raw_access_token):
    response.set_cookie(
        key=settings.SIMPLE_JWT['ACCESS_COOKIE'],
        value=raw_access_token,
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    return response


def set_cookies(response, user_instance):
    tokens = get_tokens_for_user(user_instance)
    response.set_cookie(
        key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
        value=tokens['refresh'],
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    set_access_cookie(response, tokens['access'])
    return response


def delete_cookie():
    response = Response(status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie(settings.SIMPLE_JWT['ACCESS_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['REFRESH_COOKIE'])
    response.delete_cookie('csrftoken')
    return response


def convert_token(raw_token, token_class):
    if raw_token is not None:
        token = token_class(token=raw_token)
    else:
        token = raw_token

    return token


def register(request, validated_data):
    user_instance = User.objects.create_user(username=validated_data['username'],
                                             email=validated_data['email'],
                                             password=validated_data['password'],
                                             is_active=False)
    current_site = get_current_site(request)
    mail_subject = 'Активация учётной записи'
    message = render_to_string('account_activation.html', {'username': user_instance.username,
                                                           'domain': current_site.domain,
                                                           'uid': urlsafe_base64_encode(force_bytes(user_instance.pk)),
                                                           'token': account_activation_token.make_token(user_instance)})
    to_email = user_instance.email
    email = EmailMessage(subject=mail_subject, body=message, from_email='Codeventure', to=[to_email])
    email.send()
    response = Response(data={'username': user_instance.username,
                              'email': user_instance.email,
                              'is_active': user_instance.is_active},
                        status=status.HTTP_201_CREATED)
    set_cookies(response, user_instance)
    return response


def login(user_instance):
    if user_instance is not None:
        response = Response(data={'username': user_instance.username,
                                  'email': user_instance.email,
                                  'is_active': user_instance.is_active},
                            status=status.HTTP_200_OK)
        set_cookies(response, user_instance)
        return response
    else:
        return Response(data={'detail': 'Неправильный логин или пароль'},
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
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({'detail': 'Неправильная ссылка или срок действия ссылки истёк'},
                        status=status.HTTP_400_BAD_REQUEST)


def verify(request, raw_access_token, raw_refresh_token):
    if raw_access_token is not None or raw_refresh_token is not None:
        reason = enforce_csrf(request)
        if reason is not None:
            response = logout()
            response.status_code = status.HTTP_403_FORBIDDEN
            return response

    access_token = convert_token(raw_access_token, AccessToken)
    refresh_token = convert_token(raw_refresh_token, RefreshToken)
    try:
        access_token.verify()
        return Response(data={'username': access_token.payload['username'],
                              'email': access_token.payload['email'],
                              'is_active': access_token.payload['is_active']},
                        status=status.HTTP_200_OK)
    except Exception:
        pass
    try:
        refresh_token.verify()
        access_token = refresh_token.access_token
        response = Response(data={'username': access_token.payload['username'],
                                  'email': access_token.payload['email'],
                                  'is_active': access_token.payload['is_active']},
                            status=status.HTTP_200_OK)
        response = set_access_cookie(response, access_token.__str__())
        return response
    except Exception:
        pass
    return Response(status=status.HTTP_401_UNAUTHORIZED)


def logout():
    response = delete_cookie()
    return response
