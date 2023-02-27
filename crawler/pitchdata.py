
import ssl, requests, re, json
 
from bs4 import BeautifulSoup
from utils.mysql_connect import select_pitcher_player, update_pitcher, select_all_player, insert_pitcher
# from utils.tools import get_table, convert_list

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() #關閉安全請求警告 (搭配import requests)
import urllib.request

for i in range(1 ,2):
    url="https://cpbl.com.tw/team/person?Acnt=000000"+str(i).zfill(4)

    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.text, 'html.parser')
    script_tag = soup.find_all("script")
    # print(script_tag)

    for script in script_tag:
        token = re.search(r"RequestVerificationToken: '(.*?)'", script.text)
        if token:
            # 得到RequestVerificationToken
            token = token.group(1)
            # print(token)

            url = "https://www.cpbl.com.tw/team/getpitchscore"
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
            results = json.loads(response.json()["PitchScore"])
            for x in results:
                # print(x)
                player = select_all_player(x["Name"])    
                # print(player)
                if player:
                    # print(player['id'])
                    name = x["Name"]
                    year = x["Year"]
                    player_id = player['id']
                    result = select_pitcher_player(name, year, player_id)
                    print(result)
                    # if result:
                    #     update_pitcher(x["GroundOut"],x["FlyOut"],x["NoBaseBalled"],x["SaveFail"],result["id"])
                    # else:                       
                    #     pitch = [x["Name"],x["TeamAbbrName"],x["Year"],x["Era"],x["TotalGames"],x["PitchStarting"],
                    #             x["PitchCloser"],x["CompleteGames"],x["ShoutOut"],x["Wins"],x["Loses"],x["SaveOK"],
                    #             x["ReliefPointCnt"],x["PlateAppearances"],x["PitchCnt"],x["InningPitched"],x["HittingCnt"],
                    #             x["HomeRunCnt"],x["RunCnt"],x["EarnedRunCnt"],x["BasesONBallsCnt"],x["IntentionalBasesONBallsCnt"],
                    #             x["HitBYPitchCnt"],x["StrikeOutCnt"],x["WildPitchCnt"],x["BalkCnt"],x["Whip"],x["Goao"],
                    #             player["id"],x["GroundOut"],x["FlyOut"],x["NoBaseBalled"],x["SaveFail"]
                    #             ]
                    #     print(pitch)
                        # insert_pitcher(pitch)
