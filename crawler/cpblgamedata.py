import ssl, requests, re, json
 
from bs4 import BeautifulSoup
from utils.mysql_connect import insert_game, select_game, update_game
import datetime

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() 

url="https://www.cpbl.com.tw/schedule"

response = requests.get(url, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')script_tag = soup.find_all("script")

local_time = datetime.datetime.now()
future_date = local_time + datetime.timedelta(days=20)

for script in script_tag:
    token = re.search(r"RequestVerificationToken: '(.*?)'", script.text)
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
            "calendar": "2023/01/01",
            "kindCode":"A"
        }

        response = requests.post(url, headers = headers, data=data, verify=False)
        game_datas = json.loads(response.json()["GameDatas"])
        for item in game_datas:
            game_datetime = datetime.datetime.strptime(item['PreExeDate'], '%Y-%m-%dT%H:%M:%S')
            game_date = game_datetime.date()

            if game_date <= future_date.date():
                game = [item['GameSno'],item['PreExeDate'],item['HomeTeamName'],item['HomeScore'],
                        item['HomePitcherName'],item['VisitingTeamName'],item['VisitingScore'],
                        item['VisitingPitcherName'],item['FieldAbbe'],item['WinningPitcherName'],
                        item['LoserPitcherName'],item['MvpName']]
                try:
                    result  = select_game(item['GameSno']+13)
                    if result:
                        update_game(game[3],game[4],game[6],game[7],game[8],game[9],game[10],game[11],result['id'])
                    else:
                        insert_game(game)
                except Exception as e:
                    print(f'{e}:發生錯誤')


