# Generated by Django 3.2.18 on 2023-09-25 03:49

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0082_auto_20230925_0348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 10, 2, 3, 49, 18, 649487, tzinfo=utc)),
        ),
    ]
