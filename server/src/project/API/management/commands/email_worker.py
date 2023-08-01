import json
import pika
import time
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand


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
            email = EmailMessage(subject=data['mail_subject'],
                                 body=data['message'],
                                 to=[data['to_email']])
            email.send()
        except Exception as error:
            print(error)
