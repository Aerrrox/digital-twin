# Backend Dockerfile
FROM python:3.10

WORKDIR /app

COPY ./backend /app/backend
COPY ./home /app/home
COPY ./manage.py /app/
COPY ./requirements.txt /app/

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]