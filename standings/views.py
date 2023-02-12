from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from standings.models import Fielder, All_player, Pitcher
# from .models import 

# Create your views here.
def standings(request):
    return render(request, 'standings.html')

def getPosData(request):
    try:
        if request.method == "POST":
            year = request.POST.get('year')
            pos = request.POST.get('pos')
            if pos == "投手":
                player = Pitcher.objects.filter(year=year).values("pitcher_name")
                return JsonResponse({"ok":True, "data":list(player)})
            else :
                player = Fielder.objects.filter(year=year).values("fielder_name")
                return JsonResponse({"ok":True, "data":list(player)})
    except Exception as e: 
        print(f"{e}:取得年度球員名單發生錯誤")
        return HttpResponse("list not found.")

def getPlayerInfo(request):
    try:
        if request.method == "POST":
            year = request.POST.get('year')
            name = request.POST.get('name')
            pos = request.POST.get('pos')
            if pos == "投手":
                player = Pitcher.objects.filter(year=year,pitcher_name=name).values()
                # print(list(player))
                return JsonResponse({"pitcher":True, "data":list(player)})
            else :
                player = Fielder.objects.filter(year=year,fielder_name=name).values()
                # print(list(player))
                return JsonResponse({"fielder":True, "data":list(player)})

    except Exception as e: 
        print(f"{e}:取得年度球員資料發生錯誤")
        return HttpResponse("Data not found.")

def getplayer(request):
    try:
        if request.method == "POST":
            name = request.POST.get('text')
            # print("player",name)
            player = All_player.objects.filter(player_name=name).values("id")
            inputplayer = list(player)
            # print(inputplayer)
            if inputplayer !=[]:
                return JsonResponse({"ok":True, "data":list(inputplayer)})
            else:
                return JsonResponse({"error":True, "message":"無此球員資料"})
    except Exception as e: 
        print(f"{e}:取得player資料發生錯誤")
        return HttpResponse("Player not found.")

def Players(request, _id):
    try:
        # 比對資料庫
        player = All_player.objects.filter(id=_id).values()
        player = list(player)
        # print(player)
        if player :
            name = player[0]['player_name']
            if player[0]['pos'] == "投手":
                data = All_player.objects.select_related("pitcher").filter(
                    player_name=name).values("player_name","team","num","pos","habits",
                    'height','weight','birthday','debut',
                    'AQ','Country','o_name','draft',
                    'retire','pitcher__team','pitcher__year','pitcher__ERA','pitcher__GP','pitcher__GS','pitcher__GF','pitcher__CG','pitcher__SHO',
                    'pitcher__Win','pitcher__Lose','pitcher__SV','pitcher__HLD','pitcher__PA','pitcher__PC','pitcher__IP','pitcher__Hits','pitcher__HR','pitcher__Runs','pitcher__ER','pitcher__BB','pitcher__IBB','pitcher__DB','pitcher__SO',
                    'pitcher__WP','pitcher__BK','pitcher__WHIP','pitcher__BA','pitcher__GB_FB','pitcher__K_BB','pitcher__K9','pitcher__B9','pitcher__H9')
                # print(list(data))
                if request.headers["Content-Type"] == "application/json":
                    return JsonResponse({"ok":True, "data":list(data)})
                else:
                    return render(request, "players.html", context ={"data": list(player)})
            else:
                data = All_player.objects.select_related("pitcher").filter(player_name=name).values(
                    "player_name","team","num","pos","habits",'height','weight','birthday','debut',
                    'AQ','Country','o_name','draft','retire','fielder__team','fielder__year','fielder__AVG','fielder__GP','fielder__PA','fielder__AB','fielder__Runs','fielder__RBI',
                    'fielder__Hits','fielder__one_base','fielder__two_base','fielder__three_base','fielder__HR','fielder__TB','fielder__EBH','fielder__BB','fielder__IBB','fielder__DB','fielder__SO','fielder__DP',
                    'fielder__SBH','fielder__SF','fielder__SB','fielder__CS','fielder__OBP','fielder__SLG','fielder__OPS','fielder__GB_FB','fielder__BB_K'
                )
                if request.headers["Content-Type"] == "application/json":
                    return JsonResponse({"ok":True, "data":list(data)})
                else:
                    return render(request, "players.html", context ={"data": list(player)})
    except Exception as e: 
        print(f"{e}:取得player資料發生錯誤")
        return HttpResponse("Player not found.")

# def getIndex(request):
#     pass
#     try:
#         if request.method == "GET":
#             pitch_data = Pitch_Data.objects.select_related("team").values(
#                 "team__team_name","ERA")
#             pitch_data = list(pitch_data)

#             offense = Offense.objects.select_related("team").values(
#                 "team__team_name","OBP","SLG","AVG")
#             offense = list(offense)

#             defense = Defense.objects.select_related("team").values(
#                 "team__team_name","FP"
#             )
#             defense = list(defense)

#             return JsonResponse({"ok":True, "pitch":pitch_data, "offense":offense, "defense":defense})
#         return JsonResponse({"error":True, "message":"沒有取得Standings"})
#     except Exception as e: 
#         print(f"{e}:取得Standings資料發生錯誤")
#         return ({"error":True, "message":"取得Standings資料過程發生錯誤"})
