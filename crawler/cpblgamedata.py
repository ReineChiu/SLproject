import ssl, requests, re, json
 
from bs4 import BeautifulSoup
from utils.mysql_connect import insert_game

from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() 

url="https://www.cpbl.com.tw/schedule"

response = requests.get(url, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')
script_tag = soup.find_all("script")
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
            "calendar": "2022/01/01",
            "kindCode":"A"
        }

        response = requests.post(url, headers = headers, data=data, verify=False)
        game_datas = json.loads(response.json()["GameDatas"])

        latest_date = max(datetime.fromisoformat(item['PreExeDate']) for item in game_datas if item['PreExeDate'])
        latest_items = list(filter(lambda item: item['PreExeDate'] and datetime.fromisoformat(item['PreExeDate']) == latest_date, game_datas))

        for item in latest_items:
            game = [item['GameSno'],item['PreExeDate'],item['HomeTeamName'],item['HomeScore'],
                    item['HomePitcherName'],item['VisitingTeamName'],item['VisitingScore'],
                    item['VisitingPitcherName'],item['FieldAbbe'],item['WinningPitcherName'],
                    item['LoserPitcherName'],item['MvpName']]
            insert_game(game)

