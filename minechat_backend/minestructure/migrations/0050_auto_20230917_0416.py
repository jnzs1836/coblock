# Generated by Django 3.2.18 on 2023-09-17 04:16

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0049_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='participanttaskfeedbackmodel',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2021, 7, 15, 0, 0)),
        ),
        migrations.AddField(
            model_name='participanttaskfeedbackmodel',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2021, 7, 15, 0, 0)),
        ),
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 24, 4, 16, 53, 370991, tzinfo=utc)),
        ),
    ]
