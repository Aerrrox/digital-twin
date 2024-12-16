from django.test import TestCase
from rest_framework.test import APIClient

from auth_api.models import User
from garden_api.models import Plot, Bed, Plant

import pytest

@pytest.mark.django_db
def test_get_plot_list():
    # Создаём тестового пользователя и участки
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    Plot.objects.create(user=user, title="Plot 1")
    Plot.objects.create(user=user, title="Plot 2")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем GET-запрос
    url = f'/garden_api/user/{user.id}/plot_list'
    response = client.get(url)

    # Проверяем результат
    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]['title'] == "Plot 1"
    assert response.data[1]['title'] == "Plot 2"

@pytest.mark.django_db
def test_create_new_plot():
    # Создаём тестового пользователя
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем POST-запрос для создания нового участка
    url = f'/garden_api/user/{user.id}/new_plot'
    data = {'title': 'My New Plot'}
    response = client.post(url, data, format='json')

    # Проверяем результат
    assert response.status_code == 201
    assert response.data['message'] == 'Участок создан'
    assert response.data['title'] == 'My New Plot'

    # Убедимся, что участок добавлен в базу данных
    new_plot = Plot.objects.get(title='My New Plot')
    assert new_plot.user == user

@pytest.mark.django_db
def test_get_bed_list():
    # Создаём тестового пользователя, участок и грядки
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    Bed.objects.create(plot=plot, group=1, wet=50, info="First bed")
    Bed.objects.create(plot=plot, group=2, wet=70, info="Second bed")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем GET-запрос для получения списка грядок
    url = f'/garden_api/plot/{plot.id}/bed_list'
    response = client.get(url)

    # Проверяем результат
    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]['group'] == 1
    assert response.data[0]['wet'] == 50
    assert response.data[1]['group'] == 2
    assert response.data[1]['wet'] == 70

@pytest.mark.django_db
def test_create_new_bed():
    # Создаём тестового пользователя и участок
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем POST-запрос для создания новой грядки
    url = f'/garden_api/plot/{plot.id}/new_bed'
    data = {'group': 3, 'wet': 80}  # Числовое значение для 'wet'
    response = client.post(url, data, format='json')

    # Проверяем результат
    assert response.status_code == 201
    assert response.data['message'] == 'Грядка сделана!'
    assert response.data['plot'] == "Test Plot"
    assert response.data['group'] == 3
    assert response.data['wet'] == 80

    # Убедимся, что грядка добавлена в базу данных
    new_bed = Bed.objects.get(group=3, plot=plot)
    assert new_bed.wet == 80

@pytest.mark.django_db
def test_update_plot():
    # Создаём тестового пользователя и участок
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Old Title")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем PUT-запрос для обновления участка
    url = f'/garden_api/plot/{plot.id}/update'
    data = {'title': 'New Title'}
    response = client.put(url, data, format='json')

    # Проверяем результат
    assert response.status_code == 200
    assert response.data['message'] == 'Участок обновлён'
    assert response.data['title'] == 'New Title'

    # Убедимся, что данные обновлены в базе данных
    plot.refresh_from_db()
    assert plot.title == 'New Title'

@pytest.mark.django_db
def test_delete_plot():
    # Создаём тестового пользователя и участок
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем DELETE-запрос для удаления участка
    url = f'/garden_api/plot/{plot.id}/delete'
    response = client.delete(url)

    # Проверяем результат
    assert response.status_code == 204  # Успешное удаление
    assert not Plot.objects.filter(id=plot.id).exists()  # Участок должен быть удалён

@pytest.mark.django_db
def test_update_bed():
    # Создаём тестового пользователя, участок и грядку
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    bed = Bed.objects.create(plot=plot, group=1, wet=50, info="Original Info")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем PUT-запрос для обновления грядки
    url = f'/garden_api/bed/{bed.id}/update'
    data = {'group': 2, 'wet': 75, 'info': 'Updated Info'}
    response = client.put(url, data, format='json')

    # Проверяем результат
    assert response.status_code == 200
    assert response.data['message'] == 'Грядка обновлена'
    assert response.data['group'] == 2
    assert response.data['wet'] == 75
    assert response.data['info'] == 'Updated Info'

    # Убедимся, что данные обновлены в базе
    bed.refresh_from_db()
    assert bed.group == 2
    assert bed.wet == 75
    assert bed.info == 'Updated Info'

@pytest.mark.django_db
def test_delete_bed():
    # Создаём тестового пользователя, участок и грядку
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    bed = Bed.objects.create(plot=plot, group=1, wet=50, info="Test Bed")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем DELETE-запрос для удаления грядки
    url = f'/garden_api/bed/{bed.id}/delete'
    response = client.delete(url)

    # Проверяем результат
    assert response.status_code == 204  # Успешное удаление
    assert not Bed.objects.filter(id=bed.id).exists()  # Грядка должна быть удалена

@pytest.mark.django_db
def test_add_plant_to_bed():
    # Создаём тестового пользователя, участок, грядку и растение
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    bed = Bed.objects.create(plot=plot, group=1, wet=50)
    plant = Plant.objects.create(title="Tomato", info="A healthy plant")
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем POST-запрос для добавления растения в грядку
    url = f'/garden_api/bed/{bed.id}/add_plant'
    data = {'plant': 'Tomato'}
    response = client.post(url, data, format='json')

    # Проверяем результат
    assert response.status_code == 200
    assert response.data['message'] == 'Растение добавлено'
    assert response.data['plant'] == 'Tomato'

    # Убедимся, что растение связано с грядкой
    bed.refresh_from_db()
    assert bed.plant == plant

@pytest.mark.django_db
def test_get_bed_plant():
    # Создаём тестового пользователя, участок, грядку и растение
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    bed = Bed.objects.create(plot=plot, group=1, wet=50)
    plant = Plant.objects.create(title="Tomato", info="Healthy plant")
    bed.plant = plant  # Связываем растение с грядкой
    bed.save()
    client = APIClient()

    # Получаем JWT-токен
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    assert login_response.status_code == 200
    token = login_response.data['access']

    # Добавляем токен в заголовки
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Выполняем GET-запрос для получения информации о растении
    url = f'/garden_api/bed/{bed.id}/plant'
    response = client.get(url)

    # Проверяем результат
    assert response.status_code == 200
    assert response.data['title'] == "Tomato"
    assert response.data['info'] == "Healthy plant"

@pytest.mark.django_db
def test_add_plant_to_bed_with_existing_plant():
    # Создаём тестового пользователя, участок, грядку и два растения
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass")
    plot = Plot.objects.create(user=user, title="Test Plot")
    bed = Bed.objects.create(plot=plot, group=1, wet=50)
    plant1 = Plant.objects.create(title="Tomato", info="Healthy plant")
    plant2 = Plant.objects.create(title="Cucumber", info="Fresh plant")
    bed.plant = plant1
    bed.save()

    client = APIClient()

    # Авторизация
    login_url = '/auth_api/login/'
    login_data = {'username': 'testuser', 'password': 'testpass'}
    login_response = client.post(login_url, login_data, format='json')
    token = login_response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Пытаемся добавить второе растение в грядку
    url = f'/garden_api/bed/{bed.id}/add_plant'
    data = {'plant': 'Cucumber'}
    response = client.post(url, data, format='json')

    # Проверяем, что возвращается ошибка
    assert response.status_code == 400
    assert response.data['error'] == "В грядке уже есть растение"
