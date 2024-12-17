#!/bin/bash

# Выполняем миграции
echo "Applying database migrations..."
python manage.py migrate

# Создаём суперпользователя, если он не существует
echo "Creating superuser if it doesn't exist..."
python manage.py shell -c "
from django.contrib.auth import get_user_model; 
User = get_user_model(); 
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
"

# Собираем статику
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Запускаем сервер
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000