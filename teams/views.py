from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q

from standings.models import Fielder, All_player, Pitcher

import json

# Create your views here.
def teams(request):
    return render(request, 'teams.html')

def getTeams(request):
    try:
        if request.method == 'POST':
            team = request.POST.get('team')
            teams = All_player.objects.filter(Q(team=team) | Q(team=team + "二軍")).exclude(retire="非現役").values('id','player_name','team')
            return JsonResponse({"ok":True, "data":list(teams)})
        else:
            return HttpResponse("Only POST requests are allowed.")
    except Exception as e: 
        print(f"{e}:取得球隊名單發生錯誤")
        return HttpResponse("teams not found.")
