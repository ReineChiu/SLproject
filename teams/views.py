from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q

from standings.models import Fielder, All_player, Pitcher

import json

# Create your views here.
def teams(request):
    team_name = request.GET.get('code')
    if team_name not in ['brothers', 'rakuten', 'guardians', 'dragons', 'lions']:
        return render(request, '404.html', status=404)
    else:
        return render(request, 'teams.html', {'code':team_name})

def checkTeam(request):
    if request.method == "GET":
        team_list = ['brothers', 'rakuten', 'guardians', 'dragons', 'lions']
        teamname = request.GET.get('code')
        if teamname in team_list:
            return JsonResponse({"ok":True})
        else:
            return JsonResponse({"error":True})


def getTeamPlayer(request):
    try:
        if request.method == 'POST':
            teamname = request.POST.get('code')
            team_dict = {'brothers': 10, 'rakuten': 13, 'guardians': 11, 'dragons': 12, 'lions': 1}

            team = team_dict.get(teamname)
            teams = All_player.objects.filter(Q(team=team)).exclude(retire="非現役").values('id','player_name','army','team_id')
            if teams:
                return JsonResponse({"ok":True, "data":tuple(teams)})
            else:
                return HttpResponse({"error":True, "message":"wrongcode"})
        else:
            return HttpResponse("Only POST requests are allowed.")
    except Exception as e: 
        print(f"{e}:取得球隊名單發生錯誤")
        return HttpResponse("teams not found.")
