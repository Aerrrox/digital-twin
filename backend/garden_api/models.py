from django.db import models

from auth_api.models import User

class Plant(models.Model):
    title = models.CharField('plantname', max_length=128)
    info = models.TextField('someInfo', blank=True, null=True)

class Plot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField('plotname', max_length=128, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.title == None:
            plots_count = Plot.objects.filter(user=self.user).count()
            self.title = f'Новый участок {plots_count + 1}'

        super().save(*args, **kwargs)

class Bed(models.Model):
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, blank=True, null=True)
    group = models.IntegerField(default=0)
    wet = models.PositiveSmallIntegerField(max_length=100)
    info = models.TextField('someInfo', blank=True, null=True)
