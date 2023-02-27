import urllib.request 
import json

from datetime import datetime, timedelta, timezone

src="https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=51&startDate=2023-03-08&endDate=2023-03-08&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=159&&leagueId=160&contextTeamId="
req=urllib.request.Request(src, headers={
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
})
with urllib.request.urlopen(req) as response:
    data=response.read().decode("utf-8")


data=json.loads(data)

day_list = data['dates'][0]['games']
# print(len(day_list))

for game in day_list:
    # print(game["venue"]["location"]["country"])
    tw = game["venue"]["location"]["country"]
    if tw == "Taiwan":
        # print(game['gameDate'])
        # 解析 ISO 8601 格式的字符串並轉換為 datetime 對象
        gt = datetime.fromisoformat(game['gameDate'])
        # 轉換時區為utc
        gt_utc = gt.astimezone(tz=timezone.utc)
        # print(gt_utc)
        # 轉換時間格式
        # fmt = '%Y-%m-%d %H:%M'
        # 分別取得 比賽日期、時間(台灣時區)
        date = '%Y-%m-%d'
        time = '%H:%M'
        game_date = (gt_utc + timedelta(hours=8)).strftime(date)
        game_time = (gt_utc + timedelta(hours=8)).strftime(time)

        # 取得 主客隊
        away_team = game['teams']['away']['team']['franchiseName']
        home_team = game['teams']['home']['team']['franchiseName']

        game_list = []
        game_list.append(game_date)
        game_list.append(home_team)
        game_list.append(away_team)
        game_list.append(tw)
        game_list.append(game_time)
        print(game_list)

        