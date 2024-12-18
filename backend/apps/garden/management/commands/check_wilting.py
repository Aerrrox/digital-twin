from django.core.management.base import BaseCommand
from garden.models import Bed
from django.utils.timezone import now, timedelta

class Command(BaseCommand):
    help = "Проверяет грядки на увядание"

    def handle(self, *args, **kwargs):
        wilt_threshold = now() - timedelta(days=3)  # Грядки увядают через 3 дня
        beds_to_wilt = Bed.objects.filter(last_watered__lt=wilt_threshold, is_wilted=False)

        for bed in beds_to_wilt:
            bed.is_wilted = True
            bed.save()
            self.stdout.write(f"Грядка {bed.id} увяла")

        self.stdout.write("Проверка завершена")