# Generated by Django 3.2.18 on 2024-01-12 10:48

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0114_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 1, 19, 10, 48, 1, 27220, tzinfo=utc)),
        ),
    ]