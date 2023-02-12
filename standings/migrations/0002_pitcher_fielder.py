# Generated by Django 4.1.5 on 2023-02-02 15:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('standings', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pitcher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pitcher_name', models.CharField(db_index=True, max_length=20)),
                ('team', models.CharField(max_length=20)),
                ('year', models.SmallIntegerField(db_index=True)),
                ('ERA', models.FloatField()),
                ('GP', models.SmallIntegerField()),
                ('GS', models.SmallIntegerField()),
                ('GF', models.SmallIntegerField()),
                ('CG', models.SmallIntegerField()),
                ('SHO', models.SmallIntegerField()),
                ('Win', models.SmallIntegerField()),
                ('Lose', models.SmallIntegerField()),
                ('SV', models.SmallIntegerField()),
                ('HLD', models.SmallIntegerField()),
                ('PA', models.SmallIntegerField()),
                ('PC', models.SmallIntegerField()),
                ('IP', models.FloatField()),
                ('Hits', models.SmallIntegerField()),
                ('HR', models.SmallIntegerField()),
                ('Runs', models.SmallIntegerField()),
                ('ER', models.SmallIntegerField()),
                ('BB', models.SmallIntegerField()),
                ('IBB', models.CharField(max_length=10)),
                ('DB', models.SmallIntegerField()),
                ('SO', models.SmallIntegerField()),
                ('WP', models.SmallIntegerField()),
                ('BK', models.SmallIntegerField()),
                ('WHIP', models.FloatField()),
                ('BA', models.FloatField()),
                ('GB_FB', models.FloatField()),
                ('K_BB', models.FloatField()),
                ('K9', models.FloatField()),
                ('B9', models.FloatField()),
                ('H9', models.FloatField()),
                ('all_player', models.ForeignKey(blank=True, db_column='player_id', on_delete=django.db.models.deletion.CASCADE, related_name='pitcher', to='standings.all_player')),
            ],
        ),
        migrations.CreateModel(
            name='Fielder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fielder_name', models.CharField(db_index=True, max_length=20)),
                ('team', models.CharField(max_length=20)),
                ('year', models.SmallIntegerField(db_index=True)),
                ('AVG', models.FloatField()),
                ('GP', models.SmallIntegerField()),
                ('PA', models.SmallIntegerField()),
                ('AB', models.SmallIntegerField()),
                ('Runs', models.SmallIntegerField()),
                ('RBI', models.SmallIntegerField()),
                ('Hits', models.SmallIntegerField()),
                ('one_base', models.SmallIntegerField()),
                ('two_base', models.SmallIntegerField()),
                ('three_base', models.SmallIntegerField()),
                ('HR', models.SmallIntegerField()),
                ('TB', models.SmallIntegerField()),
                ('EBH', models.SmallIntegerField()),
                ('BB', models.SmallIntegerField()),
                ('IBB', models.CharField(max_length=10)),
                ('DB', models.SmallIntegerField()),
                ('SO', models.SmallIntegerField()),
                ('DP', models.SmallIntegerField()),
                ('SBH', models.SmallIntegerField()),
                ('SF', models.SmallIntegerField()),
                ('SB', models.SmallIntegerField()),
                ('CS', models.SmallIntegerField()),
                ('OBP', models.FloatField()),
                ('SLG', models.FloatField()),
                ('OPS', models.FloatField()),
                ('GB_FB', models.FloatField()),
                ('BB_K', models.FloatField()),
                ('all_player', models.ForeignKey(blank=True, db_column='player_id', on_delete=django.db.models.deletion.CASCADE, related_name='fielder', to='standings.all_player')),
            ],
        ),
    ]
