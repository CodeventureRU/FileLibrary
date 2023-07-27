from datetime import datetime

from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.utils import timezone

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
    expires = AccessToken(token=raw_access_token).payload['exp']
    response.set_cookie(
        key=settings.SIMPLE_JWT['ACCESS_COOKIE'],
        value=raw_access_token,
        expires=datetime.fromtimestamp(expires),
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    return response


def set_cookies(response, user_instance):
    tokens = get_tokens_for_user(user_instance)
    expires = RefreshToken(token=tokens['refresh']).payload['exp']
    response.set_cookie(
        key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
        value=tokens['refresh'],
        expires=datetime.fromtimestamp(expires),
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    set_access_cookie(response, tokens['access'])
    return response


def delete_cookie(response):
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


def send_account_activation_message(request, user_instance):
    current_site = get_current_site(request)
    mail_subject = 'Активация учётной записи'
    message = render_to_string('account_activation.html', {'username': user_instance.username,
                                                           'domain': current_site.domain,
                                                           'uid': urlsafe_base64_encode(force_bytes(user_instance.pk)),
                                                           'token': account_activation_token.make_token(user_instance)})
    to_email = user_instance.email
    email = EmailMessage(subject=mail_subject, body=message, from_email='Codeventure', to=[to_email])
    email.send()


def register(request, validated_data):
    user_instance = User.objects.create_user(username=validated_data['username'],
                                             email=validated_data['email'],
                                             password=validated_data['password'],
                                             is_active=False)
    # sending email message with account activation link #
    send_account_activation_message(request, user_instance)
    return user_instance


def activate(uidb64, token):
    try:
        # getting object of user with id from link #
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return False
    # checking token and activating account #
    if account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return True
    return False


def verify(request, raw_access_token, raw_refresh_token):
    def check_user_data(token_payload, user_data):
        is_updated = False
        for key in user_data.keys():
            if token_payload[key] != user_data[key]:
                token_payload.update({key: user_data[key]})
                is_updated = True
        return is_updated

    # enforcing csrf if user trying to verify #
    if raw_access_token is not None or raw_refresh_token is not None:
        reason = enforce_csrf(request)
        if reason is not None:
            return False, reason, None

    # getting token instances #
    access_token = convert_token(raw_access_token, AccessToken)
    refresh_token = convert_token(raw_refresh_token, RefreshToken)

    try:
        # verifying access token #
        access_token.verify()
        user_instance = User.objects.get(pk=access_token.payload['pk'])
        user_data = {'username': user_instance.username,
                     'email': user_instance.email,
                     'is_active': user_instance.is_active}
        # checking the relevance of the data in the token and updating (if needed) #
        raw_access_token = None
        if check_user_data(access_token.payload, user_data):
            raw_access_token = access_token.__str__()
        return True, raw_access_token, user_data
    except Exception as ex:
        pass
    try:
        # verifying refresh token #
        refresh_token.verify()
        user_instance = User.objects.get(pk=refresh_token.payload['pk'])
        user_data = {'username': user_instance.username,
                     'email': user_instance.email,
                     'is_active': user_instance.is_active}
        # checking the relevance of the data in the token and updating (if needed) #
        check_user_data(refresh_token.payload, user_data)
        # generating new access token #
        raw_access_token = refresh_token.access_token.__str__()
        return True, raw_access_token, user_data
    except Exception:
        return False, None, None
