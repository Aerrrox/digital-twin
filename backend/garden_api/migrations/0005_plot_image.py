# Generated by Django 5.1.3 on 2024-12-17 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garden_api', '0004_bed_is_wilted'),
    ]

    operations = [
        migrations.AddField(
            model_name='plot',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='plants/'),
        ),
    ]