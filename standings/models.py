from django.db import models

# Create your models here.
class Team(models.Model):
    team_name = models.CharField(max_length=20)
    home = models.CharField(max_length=30,null=True)

class All_player(models.Model):
    player_name = models.CharField(max_length=10, db_index=True) 
    army = models.CharField(max_length=30)
    num = models.CharField(max_length=10)
    pos = models.CharField(max_length=10)
    habits = models.CharField(max_length=10)
    height = models.CharField(max_length=5)
    weight = models.CharField(max_length=5)
    birthday = models.CharField(max_length=20)
    debut = models.TextField(null=True, blank=True)
    AQ = models.TextField(null=True, blank=True)
    Country = models.CharField(max_length=20)
    o_name = models.TextField(null=True, blank=True)
    draft = models.TextField(null=True, blank=True)
    retire = models.TextField(null=True, blank=True)

    team = models.ForeignKey(
            Team, on_delete=models.PROTECT, related_name='all_player',
            blank=True, db_column='team_id'
            )


class Pitcher(models.Model):
    pitcher_name = models.CharField(max_length=20, db_index=True)
    year = models.SmallIntegerField(db_index=True)
    ERA = models.FloatField()
    GP = models.SmallIntegerField()
    GS = models.SmallIntegerField()
    GF = models.SmallIntegerField()
    CG = models.SmallIntegerField()
    SHO = models.SmallIntegerField()
    Win = models.SmallIntegerField()
    Lose = models.SmallIntegerField()
    SV = models.SmallIntegerField()
    HLD = models.SmallIntegerField()
    PA = models.SmallIntegerField()
    PC = models.SmallIntegerField()
    IP = models.FloatField()
    Hits = models.SmallIntegerField()
    HR = models.SmallIntegerField()
    Runs = models.SmallIntegerField()
    ER = models.SmallIntegerField()
    BB = models.SmallIntegerField()
    IBB = models.SmallIntegerField()
    DB = models.SmallIntegerField()
    SO = models.SmallIntegerField()
    WP = models.SmallIntegerField()
    BK = models.SmallIntegerField()
    WHIP = models.FloatField()
    GB_FB = models.FloatField()
    GB = models.SmallIntegerField(default=0)
    FB = models.SmallIntegerField(default=0)
    NO_BB = models.SmallIntegerField(default=0)
    BS = models.SmallIntegerField(default=0)

    all_player = models.ForeignKey(
            All_player, on_delete=models.CASCADE, related_name='pitcher', 
            blank=True, db_column='player_id'
            )
    team = models.ForeignKey(
            Team, on_delete=models.PROTECT, related_name='pitcher',
            blank=True, db_column='team_id'
            )


class Fielder(models.Model):
    fielder_name = models.CharField(max_length=20, db_index=True)
    year = models.SmallIntegerField(db_index=True)
    AVG = models.FloatField()
    GP = models.SmallIntegerField()
    PA = models.SmallIntegerField()
    AB = models.SmallIntegerField()
    Runs = models.SmallIntegerField()
    RBI = models.SmallIntegerField()
    Hits = models.SmallIntegerField()
    one_base = models.SmallIntegerField()
    two_base = models.SmallIntegerField()
    three_base = models.SmallIntegerField()
    HR = models.SmallIntegerField()
    TB = models.SmallIntegerField()
    EBH = models.SmallIntegerField()
    BB = models.SmallIntegerField()
    IBB = models.SmallIntegerField()
    DB = models.SmallIntegerField()
    SO = models.SmallIntegerField()
    DP = models.SmallIntegerField()
    SBH = models.SmallIntegerField()
    SF = models.SmallIntegerField()
    SB = models.SmallIntegerField()
    CS = models.SmallIntegerField()
    OBP = models.FloatField()
    SLG = models.FloatField()
    OPS = models.FloatField()
    GB_FB = models.FloatField()
    GB = models.SmallIntegerField(default=0)
    FB = models.SmallIntegerField(default=0)
    SBP = models.FloatField(default=0.0)

    all_player = models.ForeignKey(
            All_player, on_delete=models.CASCADE, related_name='fielder', 
            blank=True, db_column='player_id'
            )
    team = models.ForeignKey(
            Team, on_delete=models.PROTECT, related_name='fielder',
            blank=True, db_column='team_id'
            )


class Game(models.Model):
    number = models.SmallIntegerField()
    date = models.DateTimeField()
    homeTeam = models.CharField(max_length=30)
    homeScore = models.SmallIntegerField(null=True, blank=True)
    homePitch = models.CharField(max_length=10, null=True, blank=True)
    guestTeam = models.CharField(max_length=30)
    guestScore = models.SmallIntegerField(null=True, blank=True)
    guestPitch = models.CharField(max_length=10, null=True, blank=True)
    location = models.CharField(max_length=10)
    winPitch = models.CharField(max_length=10, null=True, blank=True)
    losePitch = models.CharField(max_length=10, null=True, blank=True)
    mvp = models.CharField(max_length=10, null=True, blank=True)
