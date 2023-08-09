import time
import schedule
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

from API.models import User


class Command(BaseCommand):

    def job(self):
        queryset = User.objects.filter(is_active=False).values('id', 'username', 'date_joined')
        for user_info in queryset:
            time_now = timezone.now()
            difference = time_now - user_info['date_joined']
            if difference > timedelta(days=1):
                user = User.objects.get(pk=user_info['id'])
                user.delete()
                print(f'[{time_now}] Deleted: id: {user_info["id"]}, '
                      f'username: {user_info["username"]}, '
                      f'last login date: {user_info["last_login"]}')
        print()

    def handle(self, *args, **options):
        print('Сервис начал свою работу... \n')
        schedule.every(3).hours.do(self.job)

        while True:
            schedule.run_pending()
            time.sleep(1)