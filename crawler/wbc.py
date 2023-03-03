import urllib.request 
import json

from datetime import datetime, timedelta, timezone
# import datetime
from utils.mysql_connect import select_game, update_game, insert_game

# # src="https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-scoreboard?stitch_env=prod&sortTemplate=4&sportId=1&&sportId=51&startDate=2023-02-26&endDate=2023-02-26&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&&gameType=C&language=en&leagueId=104&&leagueId=103&&leagueId=160&contextTeamId="

# start_date = datetime.strptime('2023-03-06', '%Y-%m-%d')
# end_date = datetime.strptime('2023-03-13', '%Y-%m-%d')

# current_date = start_date

# while current_date <= end_date:
#     # 將current_date轉換為所需的格式
#     formatted_date = current_date.strftime('%Y-%m-%d')
#     # 在URL中使用formatted_date
#     url = f'https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-scoreboard?stitch_env=prod&sortTemplate=4&sportId=51&startDate={formatted_date}&endDate={formatted_date}&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=159&&leagueId=160&contextTeamId='
# #     # 輸出URL或執行其他操作
#     # print(url)
#     req=urllib.request.Request(url, headers={
#         "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
#     })
#     with urllib.request.urlopen(req) as response:
#         data=response.read().decode("utf-8")

#     data=json.loads(data)

#     day_list = data['dates'][0]['games'] #  取得該日期當天所有比賽

#     for game in day_list:
#         # print(game["venue"]["location"]["country"])
#         tw = game["venue"]["location"]["country"]
#         if tw == "Taiwan":
#             # print(game['gameDate'])
#             # 解析 ISO 8601 格式的字符串並轉換為 datetime 對象
#             gt = datetime.fromisoformat(game['gameDate'])
#             # 轉換時區為utc
#             gt_utc = gt.astimezone(tz=timezone.utc)
#             # print(gt_utc)
#             # 轉換時間格式
#             # fmt = '%Y-%m-%d %H:%M'
#             # 分別取得 比賽日期、時間(台灣時區)
#             date = '%Y-%m-%d %H:%M'
#             # time = '%H:%M'
#             game_date = (gt_utc + timedelta(hours=8)).strftime(date)
#             # print(game_date)
#             # game_time = (gt_utc + timedelta(hours=8)).strftime(time)

#             #取得比賽編號
#             game_number = game['seriesGameNumber']

#             # 取得 主客隊
#             away_team = game['teams']['away']['team']['franchiseName']
#             home_team = game['teams']['home']['team']['franchiseName']
#             # 取得主客隊先發投手
#             if game['teams']['away'].get('probablePitcher') is not None:
#                 away_team_pitcher = game['teams']['away']['probablePitcher']['firstLastName']
#             else:
#                 away_team_pitcher = None

#             if game['teams']['home'].get('probablePitcher') is not None:
#                 home = game['teams']['home']['probablePitcher']['firstLastName']
#             else:
#                 home_team_pitcher = None

#             # 取得主客隊 比分 run hits errors
#             if game['linescore']['teams']['away'].get('runs') is not None:
#                 away_team_score = game['linescore']['teams']['away']['runs']
#             else:
#                 away_team_score = None

#             if game['linescore']['teams']['home'].get('runs') is not None:
#                 home_team_score = game['linescore']['teams']['home']['runs']
#             else:
#                 home_team_score = None

#             # 取得比賽地點
#             game_location = game['venue']['location']['city']

#             # 取得比賽勝投敗投
#             if game.get('decisions') is not None:
#                 lose_pitcher = game['decisions']['loser']['lastFirstName']
#             else:
#                 lose_pitcher = None

#             if game.get('decisions') is not None:
#                 lose_pitcher = game['decisions']['winner']['lastFirstName']
#             else:
#                 win_pitcher = None        

#             game_mvp = None

#             game_list = []
#             game_list.append(game_number)
#             game_list.append(game_date)
#             game_list.append(home_team)
#             game_list.append(home_team_score)
#             game_list.append(home_team_pitcher)
#             game_list.append(away_team)
#             game_list.append(away_team_score)
#             game_list.append(away_team_pitcher)
#             game_list.append(game_location)
#             game_list.append(lose_pitcher)
#             game_list.append(win_pitcher)
#             game_list.append(game_mvp)
#             # insert game_list 到資料庫
#             # 判斷資料庫是否存在資料 game_number,不存在insert,存在update
#             # print(game_list[0])
#             result = select_game(game_list[0])
#             if result:
#                 update_game(game_list[3],game_list[4],game_list[6],game_list[7],game_list[9],game_list[10],game_list[11],result['id'])
#             else:
#                 insert_game(game_list)
    # 更新current_date以遍歷下一個日期
    # current_date += timedelta(days=1)
# ======================================================== #

current_date = datetime.now()
# print(current_date)
# # date = current_date.date() # 取得今天日期
current_date = datetime.combine(current_date, datetime.min.time()) # 將日期轉換為 datetime 物件
change_datetime = current_date - timedelta(hours=13) # 將 current_date 減去 13 個小時
search_date = change_datetime.date() # 取得日期部分
# print(search_date)

src = f'https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-scoreboard?stitch_env=prod&sortTemplate=4&sportId=1&&sportId=51&startDate={search_date}&endDate={search_date}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&&gameType=C&language=en&leagueId=104&&leagueId=103&&leagueId=160&contextTeamId='
req=urllib.request.Request(src, headers={
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
})
with urllib.request.urlopen(req) as response:
    data=response.read().decode("utf-8")


data=json.loads(data)

day_list = data['dates'][0]['games'] #  取得該日期當天所有比賽
# print(day_list)

latest_time = None
latest_index = None # 建立索引，最新時間的那一筆索引
for index,game in enumerate(day_list):
    # print(game["venue"]["location"]["country"])
    # print(game['gameDate'])
    # 解析 ISO 8601 格式的字符串並轉換為 datetime 對象
    gt = datetime.fromisoformat(game['gameDate'])
    # 轉換時區為utc
    gt_utc = gt.astimezone(tz=timezone.utc)
    # print(gt_utc)
    # # 轉換時間格式
    # # fmt = '%Y-%m-%d %H:%M'
    # # 分別取得 比賽日期、時間(台灣時區)
    date = '%Y-%m-%d'
    time = '%H:%M'
    game_date = (gt_utc + timedelta(hours=8)).strftime(date)
    # print(game_date)
    game_time = (gt_utc + timedelta(hours=8)).strftime(time)
    # 迭代比較出最新的時間
    if latest_time is None or game_time > latest_time:
        latest_time = game_time
        latest_index = index
# print(game_date,'第',latest_index,'場',latest_time)
# print(latest_index)
gamePk = day_list[latest_index]['gamePk']
number = gamePk % 10000

new_gt = datetime.fromisoformat(game['gameDate'])
new_gt_utc = gt.astimezone(tz=timezone.utc)
date = '%Y-%m-%d %H:%M'
new_game_date = (gt_utc + timedelta(hours=8)).strftime(date)
date = new_game_date

home_team = day_list[latest_index]['teams']['home']['team']['teamName']
home_team_runs = day_list[latest_index]['linescore']['teams']['home']['runs']
home_team_hits = str(day_list[latest_index]['linescore']['teams']['home']['hits'])

away_team = day_list[latest_index]['teams']['away']['team']['teamName']
away_team_runs = day_list[latest_index]['linescore']['teams']['away']['runs']
home_team_error = str(day_list[latest_index]['linescore']['teams']['home']['errors'])

away_team_hits = str(day_list[latest_index]['linescore']['teams']['away']['hits'])
win_pitch = day_list[latest_index]['decisions']['winner']['lastInitName']
lose_pitch = day_list[latest_index]['decisions']['loser']['lastInitName']
away_team_error = str(day_list[latest_index]['linescore']['teams']['away']['errors'])

game_list = [number, date, home_team, home_team_runs, home_team_hits, away_team, away_team_runs,
            home_team_error, away_team_hits, win_pitch, lose_pitch, away_team_error
]
# print(game_list)
insert_game(game_list)
        