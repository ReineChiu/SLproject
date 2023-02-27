import ssl, requests, re, json
 
from bs4 import BeautifulSoup
from utils.mysql_connect import insert_game
# from utils.tools import get_table, convert_list

from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() #關閉安全請求警告 (搭配import requests)

url="https://www.cpbl.com.tw/schedule"

response = requests.get(url, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')
# print(soup)
script_tag = soup.find_all("script")
# print(script_tag)
for script in script_tag:
    token = re.search(r"RequestVerificationToken: '(.*?)'", script.text)
    # print(token)
    if token:
        token = token.group(1)
        url = "https://www.cpbl.com.tw/schedule/getgamedatas"
        headers={
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "requestverificationtoken": token,
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",      
                "x-requested-with": "XMLHttpRequest"
                }
        data = {
            "calendar": "2022/01/01",
            "kindCode":"A"
        }

        response = requests.post(url, headers = headers, data=data, verify=False)
        game_datas = json.loads(response.json()["GameDatas"])
        # print(game_datas)
        # for game in game_datas:
        #     print(game['GameDateTimeS'])

        latest_date = max(datetime.fromisoformat(item['PreExeDate']) for item in game_datas if item['PreExeDate'])
        latest_items = list(filter(lambda item: item['PreExeDate'] and datetime.fromisoformat(item['PreExeDate']) == latest_date, game_datas))

        for item in latest_items:
            game = [item['GameSno'],item['PreExeDate'],item['HomeTeamName'],item['HomeScore'],
                    item['HomePitcherName'],item['VisitingTeamName'],item['VisitingScore'],
                    item['VisitingPitcherName'],item['FieldAbbe'],item['WinningPitcherName'],
                    item['LoserPitcherName'],item['MvpName']]
            insert_game(game)
            # print(type(item['PreExeDate']))
            # if item['GameSno']:
            #     update
            # else:
            #     insert

        # 找出最新的日期
        # latest_date = None
        # for item in game_datas:
        #     date_str = item['PreExeDate']
        #     if date_str:
        #         # 将符合 ISO 8601 格式的日期时间字符串转换为 datetime 对象
        #         date_obj = datetime.fromisoformat(date_str)
        #         # print(dt_obj)
        #         # date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
        #         # print(date_obj)
        #         if latest_date is None or date_obj > latest_date:
        #             latest_date = date_obj
        # # print(latest_date)
        # for item in game_datas:
        #     date_str = item['PreExeDate']
        #     if date_str:
        #         date_obj = datetime.fromisoformat(date_str)
        #         # date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
        #         if date_obj == latest_date:
        #             print(item)
        #             # filtered_data = [item for item in game_datas if item['GameDateTimeE'] == latest_date]
        #             # print(filtered_data)

