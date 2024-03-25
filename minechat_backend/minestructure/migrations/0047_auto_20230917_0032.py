# Generated by Django 3.2.18 on 2023-09-17 00:32

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0046_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='participanttaskfeedbackmodel',
            name='valid',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 24, 0, 32, 49, 359662, tzinfo=utc)),
        ),
    ]