from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q

from standings.models import Fielder, All_player, Pitcher

import json

def annual(request):
    pos = request.GET.get('pos')
    year = request.GET.get('annual')
    if pos not in ['field', 'pitch']:
        return render(request, '404.html', status=404)
    if str(year) not in [str(y) for y in range(2003, 2023)]:
        return render(request, '404.html', status=404)
    else:
        return render(request, 'annual.html', {'pos':pos, 'year':year})

def checkAnnual(request):
    if request.method == "GET":
        pos = request.GET.get('pos')
        year = request.GET.get('annual')
        model = Pitcher if pos == "pitch" else Fielder
        try:
            data = model.objects.filter(year=year).values()
            if data:
                return JsonResponse({"ok": True})
            else:
                return JsonResponse({"error": True})
        except Exception as e: 
            print(f"{e}:取得年度資料發生錯誤")
            return HttpResponse("Annual not found.")

def getAnnualData(request):
    if request.method == "POST":
        pos = request.POST.get('pos')
        year = request.POST.get('annual')
        try:
            if pos == "field":
                data = Fielder.objects.all().filter(year=year).order_by(
                    '-Runs','AVG').values()
                data = tuple(data)
                return JsonResponse({"ok":True, "field":data})
            else:
                data = Pitcher.objects.all().filter(year=year).order_by(
                    '-Win','ERA').values()
                data = tuple(data)
                return JsonResponse({"ok":True, "pitch":data})
        except Exception as e: 
            print(f"{e}:取得年度資料發生錯誤")
            return HttpResponse("Annual not found.")

def getPlayerInfo(request):
    try:
        if request.method == "POST":
            year = request.POST.get('annual')
            name = request.POST.get('name')
            pos = request.POST.get('pos')
            if pos == "pitch":
                player = Pitcher.objects.filter(year=year,pitcher_name=name).values()
                return JsonResponse({"ok":True, "pitcher":tuple(player)})
            else :
                player = Fielder.objects.filter(year=year,fielder_name=name).values()
                return JsonResponse({"ok":True, "fielder":tuple(player)})

    except Exception as e: 
        print(f"{e}:取得單一球員資料發生錯誤")
        return HttpResponse("Data not found.")
