import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from garden_api.models import User

@pytest.mark.django_db
def test_register_user():
    client = APIClient()
    url = '/auth_api/register/'
    data = {"username": "testuser", "password": "testpass", "email": "test@example.com"}

    # POST-запрос на регистрацию
    response = client.post(url, data, format='json')

    # Проверки
    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data['message'] == "Пользователь успешно зарегистрирован"

    user = User.objects.get(username="testuser")
    assert user.email == "test@example.com"

@pytest.mark.django_db
def test_register_existing_user():
    User.objects.create_user(username="testuser", password="testpass", email="test@example.com")
    client = APIClient()
    url = '/auth_api/register/'
    data = {"username": "testuser", "password": "testpass", "email": "test@example.com"}

    # Повторная регистрация
    response = client.post(url, data, format='json')

    # Проверки
    assert response.status_code == 400
    assert "error" in response.data

@pytest.mark.django_db
def test_login_user():
    User.objects.create_user(username="testuser", password="testpass", email="test@example.com")
    client = APIClient()
    url = '/auth_api/login/'
    data = {"username": "testuser", "password": "testpass"}

    # POST-запрос на логин
    response = client.post(url, data, format='json')

    # Проверки
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data

@pytest.mark.django_db
def test_login_user_invalid_credentials():
    User.objects.create_user(username="testuser", password="testpass", email="test@example.com")
    client = APIClient()
    url = '/auth_api/login/'
    data = {"username": "testuser", "password": "wrongpass"}

    # Логин с неверным паролем
    response = client.post(url, data, format='json')

    # Проверки
    assert response.status_code == 401
    assert "detail" in response.data

@pytest.mark.django_db
def test_logout_user():
    from garden_api.models import User

    # Создаём пользователя
    user = User.objects.create_user(username="testuser", password="testpass", email="test@example.com")

    client = APIClient()

    # Логинимся и получаем токены
    login_url = '/auth_api/login/'
    login_data = {"username": "testuser", "password": "testpass", "email": "test@example.com"}
    login_response = client.post(login_url, login_data, format='json')

    assert login_response.status_code == 200  # Проверяем успешный логин
    access_token = login_response.data['access']
    refresh_token = login_response.data['refresh']

    # Добавляем access-токен в заголовок Authorization
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    # Отправляем refresh-токен для логаута
    logout_url = '/auth_api/logout/'
    logout_data = {"refresh": refresh_token}
    response = client.post(logout_url, logout_data, format='json')

    # Проверки
    assert response.status_code == 205

@pytest.mark.django_db
def test_home_view():
    user = User.objects.create_user(username="testuser", password="testpass", email="test@example.com")
    client = APIClient()

    # Получаем токен для пользователя
    login_response = client.post('/auth_api/login/', {"username": "testuser", "password": "testpass"}, format='json')
    token = login_response.data['access']

    # Запрос к HomeView с токеном
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    url = '/auth_api/home/'

    response = client.get(url)

    # Проверки
    assert response.status_code == 200
    assert response.data['username'] == "testuser"
    assert "user_id" in response.data

@pytest.mark.django_db
def test_home_view_unauthorized():
    client = APIClient()
    url = '/auth_api/home/'

    # Запрос без токена
    response = client.get(url)

    # Проверки
    assert response.status_code == 401
    assert "detail" in response.data