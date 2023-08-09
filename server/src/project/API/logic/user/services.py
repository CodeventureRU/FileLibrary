import json
import pika
import os
from datetime import datetime

from django.conf import settings
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from API.authentication import enforce_csrf
from API.models import User
from API.tokens import token_generator


# Secondary functions #
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
        expires=datetime.utcfromtimestamp(expires),
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
        expires=datetime.utcfromtimestamp(expires),
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


# Email function #
def send_email_message(purpose, user_instance, new_email=None):
    data = json.dumps({'purpose': purpose,
                       'pk': user_instance.pk,
                       'new_email': new_email})
    try:
        hostname = os.environ.get('RABBIT_HOST')
        port = int(os.environ.get('RABBIT_PORT'))
        parameters = pika.ConnectionParameters(host=hostname, port=port)
        connection = pika.BlockingConnection(parameters=parameters)
        channel = connection.channel()
        channel.queue_declare(queue='to_email')
        channel.basic_publish(exchange='',
                              routing_key='to_email',
                              body=data)
        connection.close()
    except Exception as ex:
        print(ex)


# User auth functions #
def register(request, validated_data):
    user_instance = User.objects.create_user(username=validated_data['username'],
                                             email=validated_data['email'],
                                             password=validated_data['password'],
                                             is_active=False)
    # sending email message with account activation link #
    send_email_message('account_activation', user_instance)
    return user_instance


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


# Functions for interacting with links from mail #
def activate(uidb64, token):
    try:
        # getting object of user with id from link #
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return False
    # checking token and activating account #
    if token_generator.check_token(user, token):
        user.is_active = True
        user.save(update_fields=['is_active'])
        return True
    return False


def reset_password(new_password, uidb64, token):
    try:
        # getting object of user with id from link #
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return False
    # checking token and setting new password #
    if token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save(update_fields=['password'])
        return True
    return False


def confirm_email(user_instance, uidb64, email64, token):
    try:
        # getting object of user with id from link #
        uid = force_str(urlsafe_base64_decode(uidb64))
        email = force_str(urlsafe_base64_decode(email64))
        user_instance_from_link = User.objects.get(pk=uid)
        # checking token (link validity check) #
        if token_generator.check_token(user_instance_from_link, token):
            # checking if the user is logged into the correct account #
            if user_instance != user_instance_from_link:
                return None
            user_instance_from_link.email = email
            user_instance_from_link.save(update_fields=['email'])
            return True
        return False
    except Exception:
        return False
