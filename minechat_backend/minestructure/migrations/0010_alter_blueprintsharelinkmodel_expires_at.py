# Generated by Django 3.2.18 on 2023-06-16 13:30

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0009_auto_20230616_1319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 23, 13, 30, 12, 31558, tzinfo=utc)),
        ),
    ]