# Generated by Django 3.2.18 on 2023-12-21 09:18

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0088_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 28, 9, 18, 46, 488691, tzinfo=utc)),
        ),
    ]