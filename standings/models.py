from django.db import models

# Create your models here.
# class Team_1(models.Model):
#     team_name = models.CharField(max_length=30)
#     leader = models.CharField(max_length=20)
#     coach = models.CharField(max_length=20)
#     home = models.CharField(max_length=30)

class All_player(models.Model):
    player_name = models.CharField(max_length=10, db_index=True) # models.PositiveSmallIntegerField()
    team = models.CharField(max_length=30)
    num = models.CharField(max_length=10)
    pos = models.CharField(max_length=10) # models.FloatField()
    habits = models.CharField(max_length=10)
    height = models.CharField(max_length=5)# models.SmallIntegerField()
    weight = models.CharField(max_length=5)# models.SmallIntegerField()
    birthday = models.CharField(max_length=20)
    debut = models.TextField(null=True, blank=True)
    AQ = models.TextField(null=True, blank=True)
    Country = models.CharField(max_length=20)
    o_name = models.TextField(null=True, blank=True)
    draft = models.TextField(null=True, blank=True)
    retire = models.TextField(null=True, blank=True)#可以為空

class Pitcher(models.Model):
    pitcher_name = models.CharField(max_length=20, db_index=True)
    team = models.CharField(max_length=20)
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
    IBB = models.CharField(max_length=10)
    DB = models.SmallIntegerField()
    SO = models.SmallIntegerField()
    WP = models.SmallIntegerField()
    BK = models.SmallIntegerField()
    WHIP = models.FloatField()
    BA = models.FloatField()
    GB_FB = models.FloatField()
    K_BB = models.FloatField()
    K9 = models.FloatField()
    B9 = models.FloatField()
    H9 = models.FloatField()

    all_player = models.ForeignKey(
            All_player, on_delete=models.CASCADE, related_name='pitcher', 
            blank=True, db_column='player_id'
            )

class Fielder(models.Model):
    fielder_name = models.CharField(max_length=20, db_index=True)
    team = models.CharField(max_length=20)
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
    IBB = models.CharField(max_length=10)
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
    BB_K = models.FloatField()

    all_player = models.ForeignKey(
            All_player, on_delete=models.CASCADE, related_name='fielder', 
            blank=True, db_column='player_id'
            )
