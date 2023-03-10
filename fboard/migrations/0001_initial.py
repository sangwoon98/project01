# Generated by Django 4.0.5 on 2022-08-31 13:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Fboard',
            fields=[
                ('f_No', models.AutoField(primary_key=True, serialize=False)),
                ('f_Title', models.CharField(max_length=100)),
                ('f_Detail', models.CharField(max_length=3000)),
                ('f_group', models.IntegerField(default=0)),
                ('f_step', models.IntegerField(default=0)),
                ('f_indent', models.IntegerField(default=0)),
                ('f_createdate', models.DateTimeField(blank=True, default=datetime.datetime(2022, 8, 31, 22, 12, 49, 194334))),
                ('f_updatedate', models.DateTimeField(blank=True, default=datetime.datetime(2022, 8, 31, 22, 12, 49, 194344))),
                ('f_hit', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Lboard',
            fields=[
                ('L_No', models.AutoField(primary_key=True, serialize=False)),
                ('L_Title', models.CharField(max_length=100)),
                ('L_Detail', models.CharField(max_length=1000)),
                ('L_createdate', models.DateTimeField(blank=True, default=datetime.datetime(2022, 8, 31, 22, 12, 49, 194519))),
                ('L_updatedate', models.DateTimeField(blank=True, default=datetime.datetime(2022, 8, 31, 22, 12, 49, 194527))),
            ],
        ),
    ]
