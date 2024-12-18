from django.db import models

from users.models import User

class Plant(models.Model):
    title = models.CharField('plantname', max_length=128, unique=True)
    info = models.TextField('someInfo', blank=True, null=True)

    def __str__(self):
        return self.title

class Plot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField('plotname', max_length=128, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.title == None:
            plots_count = Plot.objects.filter(user=self.user).count()
            self.title = f'Новый участок {plots_count + 1}'

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Bed(models.Model):
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, blank=True, null=True)
    group = models.IntegerField(default=0)
    wet = models.PositiveSmallIntegerField(max_length=100, blank=True, null=True)
    info = models.TextField('someInfo', blank=True, null=True)
    last_watered = models.DateTimeField(null=True, blank=True)
    is_wilted = models.BooleanField(default=False)
