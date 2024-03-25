# Generated by Django 3.2.18 on 2023-09-17 06:51

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('minestructure', '0057_alter_blueprintsharelinkmodel_expires_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskpool',
            name='upper_limit',
            field=models.IntegerField(default=10),
        ),
        migrations.AddField(
            model_name='taskpool',
            name='user_task_limit',
            field=models.IntegerField(default=5),
        ),
        migrations.AlterField(
            model_name='blueprintsharelinkmodel',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 24, 6, 51, 2, 385507, tzinfo=utc)),
        ),
    ]