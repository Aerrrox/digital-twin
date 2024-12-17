from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Bed

@shared_task
def check_wilting():
    """Проверка увядания грядок, которые не поливали более 3 дней"""
    now = timezone.now()
    beds = Bed.objects.filter(last_watered__lt=now - timedelta(days=3))
    for bed in beds:
        bed.is_wilted = True
        bed.save()
    return f"{beds.count()} грядок увяли"