from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from standings.models import Fielder, All_player, Pitcher, Game
from django.db.models import F


# Create your views here.

def standings(request):
    return render(request, 'standings.html')

def getPlayerName(request):
    try:
        if request.method == 'POST':
            name = request.POST.get('name')
            if len(name) > 0:
                player = All_player.objects.filter(player_name__icontains=name).values()
                inputplayer = tuple(player)
                if inputplayer :
                    return JsonResponse({'ok':True, 'data':inputplayer})
                else:
                    return JsonResponse({'error':True, 'message':'無此球員資料'})
    except Exception as e: 
        print(f'{e}:取得player資料發生錯誤')
        return HttpResponse('Player not found.')

def checkPlayer(request,_id):
    try:
        if request.method == 'POST':
            name = request.POST.get('searchname')
            _id = _id
            player = All_player.objects.filter(id=_id,player_name=name)
            checkplayer = tuple(player)
            
            if checkplayer :
                return JsonResponse({'ok':True})
            else:
                return JsonResponse({'error':True, 'message':'查無相關資料'})
    except Exception as e: 
        print(f'{e}:核對姓名&id資料發生錯誤')
        return HttpResponse('Player not found.')

def getRanking(request):
    try:
        if request.method == 'POST':
            fieldyear = request.POST.get('fieldyear')
            pitchyear = request.POST.get('pitchyear')
            fieldrank = Fielder.objects.all().filter(year=fieldyear, GP__gt=90).order_by(
                '-AVG')[:5].values('AVG','fielder_name','team')
            pitchrank = Pitcher.objects.all().filter(year=pitchyear, IP__gt=119).order_by(
                'ERA')[:5].values('ERA','pitcher_name','team')

            fieldrank = tuple(fieldrank)
            pitchrank = tuple(pitchrank)
            return JsonResponse({'ok':True, 'field':fieldrank, 'pitch':pitchrank})
    except Exception as e: 
        print(f'{e}:取得排行名單發生錯誤')
        return HttpResponse('rank not found.')

def getGame(request):
    try:
        game_data = Game.objects.all().values()
        return JsonResponse({'ok':True,'data':list(game_data)})
    except Exception as e: 
        print(f'{e}:取得比賽資訊發生錯誤')
        return HttpResponse('game not found.')
      

def Player(request, _id):
    try:
        player_id = int(_id)
        if str(player_id) not in [str(y) for y in range(1, 2244)]:
            return render(request, '404.html', status=404)
        else:
            return render(request, 'players.html')
    except Exception as e: 
        print(f'{e}:取得player資料發生錯誤')
        return HttpResponse('Player not found.')

def getPlayerData(request):
    try:
        if request.method == 'POST':
            _id = request.POST.get('playerId')
            player = All_player.objects.filter(id=_id).values('id','player_name','pos')
            player = tuple(player)
            player_info = All_player.objects.filter(id=_id).values()
            player_info = tuple(player_info)
            if player :
                name = player[0]['player_name']
                if player[0]['pos'] == "投手":
                    data = Pitcher.objects.select_related("all_player", "team").filter(pitcher_name=name).values(
                        "all_player__player_name","all_player__army","all_player__num","all_player__pos","all_player__habits",
                        'all_player__height','all_player__weight','all_player__birthday','all_player__debut','all_player__AQ',
                        'all_player__Country','all_player__o_name','all_player__draft','all_player__retire','year','ERA','GP',
                        'GS','GF','CG','SHO','Win','Lose','SV','HLD','PA','PC','IP','Hits','HR','Runs','ER','BB','IBB','DB',
                        'SO','WP','BK','WHIP','GB_FB','GB','FB','NO_BB','BS',"team__team_name"
                        ).order_by(F('year').desc(nulls_last=True)).distinct()
                    if data:
                        return JsonResponse({'ok':True, 'data':tuple(data)})
                    else:
                        return JsonResponse({'info':True, 'data':player_info})
                else:
                    data = Fielder.objects.select_related("all_player", "team").filter(fielder_name=name).values(
                        "all_player__player_name","all_player__army","all_player__num","all_player__pos","all_player__habits",
                        'all_player__height','all_player__weight','all_player__birthday','all_player__debut','all_player__AQ',
                        'all_player__Country','all_player__o_name','all_player__draft','all_player__retire','year','AVG','GP',
                        'PA','AB','Runs','RBI','Hits','one_base','two_base','three_base','HR','TB','EBH','BB','IBB','DB','SO',
                        'DP','SBH','SF','SB','CS','OBP','SLG','OPS','GB_FB','GB','FB','SBP',"team__team_name"
                        ).order_by(F('year').desc(nulls_last=True)).distinct()
                    if data:
                        return JsonResponse({'ok':True, 'data':tuple(data)})
                    else:
                        return JsonResponse({'info':True, 'data':player_info})
                    return JsonResponse({'ok':True, 'data':tuple(data)})
            else:
                return JsonResponse({'error':True, 'message':'查無相關資料'})
    except Exception as e: 
        print(f'{e}:取得player資料發生錯誤')
        return HttpResponse('Player not found.')

