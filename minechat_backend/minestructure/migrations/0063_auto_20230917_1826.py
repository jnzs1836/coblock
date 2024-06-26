# Generated by Django 3.2.18 on 2023-09-17 18:26

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0062_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='collaborationexperimentfeedbackmodel',
            name='is_complete',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 24, 18, 26, 26, 108615, tzinfo=utc)),
        ),
    ]
