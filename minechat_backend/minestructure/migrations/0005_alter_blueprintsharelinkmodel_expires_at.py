# Generated by Django 3.2.18 on 2023-05-05 06:41

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0004_auto_20230505_0641'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 5, 12, 6, 41, 13, 532151, tzinfo=utc)),
        ),
    ]
