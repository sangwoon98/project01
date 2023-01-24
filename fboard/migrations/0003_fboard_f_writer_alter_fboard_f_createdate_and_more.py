# Generated by Django 4.0.5 on 2022-08-31 23:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fboard', '0002_alter_fboard_f_createdate_alter_fboard_f_updatedate_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='fboard',
            name='f_writer',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='fboard',
            name='f_createdate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 9, 1, 8, 45, 46, 180411)),
        ),
        migrations.AlterField(
            model_name='fboard',
            name='f_updatedate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 9, 1, 8, 45, 46, 180422)),
        ),
        migrations.AlterField(
            model_name='lboard',
            name='L_createdate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 9, 1, 8, 45, 46, 180599)),
        ),
        migrations.AlterField(
            model_name='lboard',
            name='L_updatedate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 9, 1, 8, 45, 46, 180607)),
        ),
    ]