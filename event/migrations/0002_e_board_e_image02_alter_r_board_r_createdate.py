# Generated by Django 4.0.5 on 2022-08-23 04:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='e_board',
            name='E_image02',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='r_board',
            name='R_createdate',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2022, 8, 23, 13, 23, 7, 932692)),
        ),
    ]
