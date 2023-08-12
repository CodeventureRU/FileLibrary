# pull official base image
FROM python:3.10-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk add --no-cache gcc musl-dev postgresql-dev python3-dev libffi-dev \
    && pip install --upgrade pip

# Обновите индекс пакетов и установите необходимые пакеты
RUN apk add --no-cache supervisor

# Копируйте файл конфигурации supervisord
COPY supervisord.conf ./supervisord.conf

# install dependencies
RUN pip install --upgrade pip
COPY ./src/project/requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# copy project
COPY ./src/project .

VOLUME /usr/src/app/media

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]