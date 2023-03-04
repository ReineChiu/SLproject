from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from standings.models import Fielder, All_player, Pitcher, Game
from django.db.models import F


# Create your views here.

def standings(request):
    return render(request, 'standings.html')

def getPlayerName(request):
    try:
        if request.method == "POST":
            name = request.POST.get('name')
            if len(name) > 0:
                player = All_player.objects.filter(player_name__icontains=name).values()
                inputplayer = tuple(player)
                if inputplayer :
                    return JsonResponse({"ok":True, "data":inputplayer})
                else:
                    return JsonResponse({"error":True, "message":"無此球員資料"})
    except Exception as e: 
        print(f"{e}:取得player資料發生錯誤")
        return HttpResponse("Player not found.")

def checkPlayer(request):
    try:
        if request.method == "GET":
            _id = request.GET.get('num')
            name = request.GET.get('name')

            player = All_player.objects.filter(id=_id,player_name=name)
            checkplayer = tuple(player)

            if checkplayer :
                return JsonResponse({"ok":True})
            else:
                return JsonResponse({"error":True, "message":"查無相關資料"})
    except Exception as e: 
        print(f"{e}:核對姓名&id資料發生錯誤")
        return HttpResponse("Player not found.")

def getRanking(request):
    try:
        if request.method == "POST":
            fieldyear = request.POST.get('fieldyear')
            pitchyear = request.POST.get('pitchyear')
            fieldrank = Fielder.objects.all().filter(year=fieldyear, GP__gt=90).order_by(
                '-AVG')[:5].values("AVG","fielder_name","team")
            pitchrank = Pitcher.objects.all().filter(year=pitchyear, IP__gt=119).order_by(
                'ERA')[:5].values("ERA","pitcher_name","team")

            fieldrank = tuple(fieldrank)
            pitchrank = tuple(pitchrank)
            return JsonResponse({"ok":True, "field":fieldrank, "pitch":pitchrank})
    except Exception as e: 
        print(f"{e}:取得排行名單發生錯誤")
        return HttpResponse("rank not found.")

def getGame(request):
    try:
        game_data = Game.objects.all().values()
        return JsonResponse({"ok":True,"data":tuple(game_data)})
    except Exception as e: 
        print(f"{e}:取得比賽資訊發生錯誤")
        return HttpResponse("game not found.")
      


def Player(request):
    player_id = request.GET.get('num')
    if str(player_id) not in [str(y) for y in range(1, 2244)]:
        return render(request, '404.html', status=404)
    else:
        return render(request, 'players.html', {'num':player_id})

def getPlayerData(request):
    try:
        if request.method == "GET":
            _id = request.GET.get('num')
            player = All_player.objects.filter(id=_id).values("id","player_name","pos")
            player = tuple(player)
            if player :
                name = player[0]['player_name']
                if player[0]['pos'] == "投手":
                    data = All_player.objects.select_related("pitcher").filter(player_name=name).values(
                        "player_name","army","num","pos","habits",'height','weight','birthday','debut','AQ',
                        'Country','o_name','draft','retire','pitcher__team','pitcher__year',
                        'pitcher__ERA','pitcher__GP','pitcher__GS','pitcher__GF','pitcher__CG','pitcher__SHO',
                        'pitcher__Win','pitcher__Lose','pitcher__SV','pitcher__HLD','pitcher__PA','pitcher__PC',
                        'pitcher__IP','pitcher__Hits','pitcher__HR','pitcher__Runs','pitcher__ER','pitcher__BB',
                        'pitcher__IBB','pitcher__DB','pitcher__SO','pitcher__WP','pitcher__BK','pitcher__WHIP',
                        'pitcher__GB_FB','pitcher__GB','pitcher__FB','pitcher__NO_BB','pitcher__BS','team__team_name'
                        ).order_by(F('pitcher__year').desc(nulls_last=True))
                    return JsonResponse({"ok":True, "data":tuple(data)})
                else:
                    data = All_player.objects.select_related("fielder").filter(player_name=name).values(
                        "player_name","army","num","pos","habits",'height','weight','birthday','debut','AQ',
                        'Country','o_name','draft','retire','fielder__team','fielder__year','fielder__AVG',
                        'fielder__GP','fielder__PA','fielder__AB','fielder__Runs','fielder__RBI','fielder__Hits',
                        'fielder__one_base','fielder__two_base','fielder__three_base','fielder__HR','fielder__TB',
                        'fielder__EBH','fielder__BB','fielder__IBB','fielder__DB','fielder__SO','fielder__DP',
                        'fielder__SBH','fielder__SF','fielder__SB','fielder__CS','fielder__OBP','fielder__SLG',
                        'fielder__OPS','fielder__GB_FB','fielder__GB','fielder__FB','fielder__SBP','team__team_name'
                        ).order_by(F('fielder__year').desc(nulls_last=True)).distinct()
                    return JsonResponse({"ok":True, "data":tuple(data)})
            else:
                return JsonResponse({"error":True, "message":"查無相關資料"})
    except Exception as e: 
        print(f"{e}:取得player資料發生錯誤")
        return HttpResponse("Player not found.")

