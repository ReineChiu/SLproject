"""stoveleague URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
# from django.conf.urls import handler404

from standings.views import standings, getPlayerName, checkPlayer, getRanking, getGame, Player, getPlayerData#, players_name
from teams.views import teams, checkTeam, getTeamPlayer
from annual.views import annual, checkAnnual, getAnnualData, getPlayerInfo


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', standings),
    path('api/getplayername', getPlayerName),
    path('api/checkplayer', checkPlayer),
    path('player', Player),
    path('api/player', getPlayerData),
    path('api/getranking', getRanking),
    path('api/getgame', getGame),
    path('teams', teams),
    path('api/team', checkTeam),
    path('api/getTeamPlayer', getTeamPlayer),
    path('annual', annual), 
    path('api/annual', checkAnnual),
    path('api/annualdata', getAnnualData),  
    path('api/getPlayerInfo', getPlayerInfo),
]

