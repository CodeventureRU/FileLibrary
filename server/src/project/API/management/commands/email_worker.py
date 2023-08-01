import json
import pika
import time
import os

from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand

from API.models import User
from API.tokens import token_generator


class Command(BaseCommand):
    def handle(self, *args, **options):
        count_try = 0
        conn = False
        while not conn:
            count_try += 1
            print(f'I`m EMAIL WORKER. Попытка присоединится №{count_try}')
            conn, channel = self.initial()
            if not conn:
                time.sleep(2)
        print(' [*] I`m EMAIL WORKER and i`m Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()

    def initial(self):
        try:
            hostname = 'localhost'
            port = 5672
            parameters = pika.ConnectionParameters(host=hostname, port=port)
            connection = pika.BlockingConnection(parameters=parameters)
            channel = connection.channel()
            channel.queue_declare(queue='to_email')
            try:
                channel.basic_consume(queue='to_email',
                                      auto_ack=True,
                                      on_message_callback=self.callback)
            except Exception as error:
                print(error)
            return True, channel
        except:
            return False, None

    @staticmethod
    def callback(ch, method, properties, body):
        try:
            data = json.loads(body)
            purpose = data['purpose']
            pk = data['pk']
            new_email = data['new_email']
            user_instance = User.objects.get(pk=pk)
            username = user_instance.username
            email = user_instance.email

            templates = {
                'account_activation': {
                    'to_email': email,
                    'template': 'account_activation.html',
                    'mail_subject': 'Активация учётной записи',
                },
                'reset_password': {
                    'to_email': email,
                    'template': 'reset_password.html',
                    'mail_subject': 'Сброс пароля'
                },
                'email_confirmation': {
                    'to_email': new_email,
                    'template': 'email_confirmation.html',
                    'mail_subject': 'Подтверждение смены почты',
                    'kwargs': {'email64': urlsafe_base64_encode(force_bytes(new_email)),
                               'old_email': email,
                               'email': new_email}
                }
            }

            to_email = templates[purpose]['to_email']
            mail_subject = templates[purpose]['mail_subject']
            template = templates[purpose]['template']
            message_data = {'username': username,
                            'domain': os.environ.get('DOMAIN'),
                            'uid': urlsafe_base64_encode(force_bytes(pk)),
                            'token': token_generator.make_token(user_instance)}

            if 'kwargs' in templates[purpose]:
                message_data.update(templates[purpose]['kwargs'])

            message = render_to_string(template, message_data)
            email = EmailMessage(subject=mail_subject,
                                 body=message,
                                 to=[to_email])
            email.send()
        except Exception as error:
            print(error)
