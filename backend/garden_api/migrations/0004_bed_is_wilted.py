# Generated by Django 5.1.3 on 2024-12-16 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garden_api', '0003_bed_last_watered'),
    ]

    operations = [
        migrations.AddField(
            model_name='bed',
            name='is_wilted',
            field=models.BooleanField(default=False),
        ),
    ]
