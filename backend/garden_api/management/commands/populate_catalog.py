from django.core.management.base import BaseCommand
from garden_api.models import Plant

class Command(BaseCommand):
    help = "Populate catalog of plants"

    def handle(self, *args, **kwargs):
        plants = [
            {"title": "Помидор", "info": "Кустовое растение с плодами"},
            {"title": "Огурец", "info": "Плетущееся растение для теплиц"},
            {"title": "Морковь", "info": "Корнеплод, полезный для зрения"},
            {"title": "Капуста", "info": "Листовое растение для салатов"},
            {"title": "Картофель", "info": "Корнеплод, основа рациона"},
        ]

        for plant_data in plants:
            Plant.objects.get_or_create(title=plant_data["title"], info=plant_data["info"])

        self.stdout.write(self.style.SUCCESS("Каталог растений успешно заполнен"))