import ssl, requests, re, json
 
from bs4 import BeautifulSoup
from utils.mysql_connect import select_fielder_player, update_fielder, select_all_player, insert_fielder
# from utils.tools import get_table, convert_list

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() #關閉安全請求警告 (搭配import requests)
import urllib.request

for i in range(6000 ,7000):
    url="https://cpbl.com.tw/team/person?Acnt=000000"+str(i).zfill(4)

    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.text, 'html.parser')
    script_tag = soup.find_all("script")

    for script in script_tag:
        token = re.search(r"RequestVerificationToken: '(.*?)'", script.text)
        if token:
            # 得到RequestVerificationToken
            token = token.group(1)

            url = "https://www.cpbl.com.tw/team/getbattingscore"
            headers={
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "requestverificationtoken": token,
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",      
                    "x-requested-with": "XMLHttpRequest"
                    }
            data = {
                "acnt":"000000"+str(i).zfill(4),
                "kindCode":"A"
            }

            response = requests.post(url, headers = headers, data=data, verify=False)
            results = json.loads(response.json()["BattingScore"]) 
            for x in results:
                player = select_all_player(x["Name"])
                if player:
                    name = x["Name"]
                    year = x["Year"]
                    result = select_fielder_player(name, year)
                    if result:
                        update_fielder(x["GroundOut"],x["FlyOut"],x["SB"],result["id"])
                    else:                       
                        field = [x["Name"],x["TeamAbbrName"],x["Year"],x["Avg"],x["TotalGames"],x["PlateAppearances"],
                                x["HitCnt"],x["ScoreCnt"],x["RunBattedINCnt"],x["HittingCnt"],x["OneBaseHitCnt"],
                                x["TwoBaseHitCnt"],x["ThreeBaseHitCnt"],x["HomeRunCnt"],x["TotalBases"],
                                x["TwoBaseHitCnt"]+x["ThreeBaseHitCnt"]+x["HomeRunCnt"],x["BasesONBallsCnt"],
                                x["IntentionalBasesONBallsCnt"],x["HitBYPitchCnt"],x["StrikeOutCnt"],
                                x["DoublePlayBatCnt"],x["SacrificeHitCnt"],x["SacrificeFlyCnt"],x["StealBaseOKCnt"],
                                x["StealBaseFailCnt"],x["Obp"],x["Slg"],x["Ops"],x["Goao"],
                                # (x["BasesONBallsCnt"]+x["IntentionalBasesONBallsCnt"]+x["HitBYPitchCnt"])/x["StrikeOutCnt"],
                                player["id"],x["GroundOut"],x["FlyOut"],x["SB"]
                                ]
                        insert_fielder(field)
