from django.core.exceptions import ValidationError
from string import ascii_letters


def UsernameValidator(username):
    for char in username:
        if (not char.isdigit()) and (char not in ascii_letters) and (char not in '_.'):
            raise ValidationError(
                "В имени пользователя допустимы только буквы латинcкого алфавита, цифры, символы '_' и '.'")
