# Generated by Django 4.1.5 on 2023-02-20 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('standings', '0004_remove_pitcher_b9_remove_pitcher_ba_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fielder',
            name='IBB',
            field=models.SmallIntegerField(),
        ),
        migrations.AlterField(
            model_name='pitcher',
            name='IBB',
            field=models.SmallIntegerField(),
        ),
    ]
