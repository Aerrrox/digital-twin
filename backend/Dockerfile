FROM python:3.12-slim

# Устанавливаем локали для поддержки русского языка
RUN apt-get update && apt-get install -y locales && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "ru_RU.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen

ENV LANG=ru_RU.UTF-8 \
    LANGUAGE=ru_RU:ru \
    LC_ALL=ru_RU.UTF-8

# Рабочая директория
WORKDIR /app

# Копируем requirements и устанавливаем зависимости
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код проекта
COPY . .

# Собираем статику (если нужно)
RUN python manage.py collectstatic --noinput

# Добавляем скрипт entrypoint.sh для запуска дополнительных команд
COPY ./entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Переменные окружения для сервисов
ENV CELERY_BROKER_URL=redis://redis:6379/1
ENV CELERY_RESULT_BACKEND=redis://redis:6379/2
ENV POSTGRES_HOST=postgres
ENV POSTGRES_DB=your_db_name
ENV POSTGRES_USER=your_user
ENV POSTGRES_PASSWORD=your_password

# Запускаем проект через entrypoint
CMD ["sh", "/app/entrypoint.sh"]