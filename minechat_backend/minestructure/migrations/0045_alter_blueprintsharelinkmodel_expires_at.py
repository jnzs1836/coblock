# Generated by Django 3.2.18 on 2023-09-17 00:07

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0044_auto_20230917_0006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 24, 0, 7, 13, 699427, tzinfo=utc)),
        ),
    ]
