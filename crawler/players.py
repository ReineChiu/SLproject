import ssl, requests, re
 
from bs4 import BeautifulSoup
from utils.mysql_connect import insert_allplayer, select_all_player, update_allplayer
from utils.tools import get_table, convert_list

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() 

def getData(url):
    response = requests.post(
        url, 
        headers = {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
        },
        verify=False)
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup

def process_list(input_list):
    if len(input_list) == 0:
        input_list =['X']
    output = input_list[0]
    return output

counter = []

teams = [
    '統一7-ELEVEn獅', '統一7-ELEVEn獅二軍', '中信兄弟', '中信兄弟二軍', '味全龍', '味全龍二軍', '富邦悍將', '富邦悍將二軍',
    '樂天桃猿', '樂天桃猿二軍', 'Lamigo', 'Lamigo二軍', '兄弟', '兄弟二軍', '義大', '義大二軍', '興農', '興農二軍',
    '中信', '誠泰', '第一', '米迪亞'
]

for i in range(2000 ,3000):
    url="https://cpbl.com.tw/team/person?Acnt=000000"+str(i).zfill(4)
    soup = getData(url)
    dts = soup.find_all("dt")
    dt = [dt.text for dt in dts]
    dt = dt[0:-1]
    dt = list(map(str.strip, dt))
    dt = [x for num in dt for x in re.split(r'\s', num)] 

    if dt[0] in teams: 
        descs = soup.find_all("div", class_="desc")
        desc = [desc.text for desc in descs] 
        ele = re.findall(r'\d+', desc[2]) 
        index = desc.index(desc[2])
        desc[index:index+1] = ele 

        num = re.findall(r'\d+', dt[1])
        num = process_list(num)
        name = re.sub(r'\d+', '', dt[1]).strip()
        name = re.sub(r'[#*◎]', '', name) 
        team = dt[0]
        dt[0:2] = [name, team, num]
        dt.extend(desc)
        dt.append('')
        counter.append(dt)

try:
    result  = select_all_player(counter[0][0],counter[0][7])
    if result:
        if "統一" in counter[0][1]:
            team_id = 1
        elif "中信兄弟" in counter[0][1]:
            team_id = 10
        elif "富邦悍將" in counter[0][1]:
            team_id = 11
        elif "味全龍" in counter[0][1]:
            team_id = 12
        else:
            team_id = 13
        update_allplayer(counter[0][1],counter[0][2],counter[0][3],counter[0][4],counter[0][11],counter[0][13],team_id,result['id'])
    else:
        print('沒有此球員資料')
except Exception as e:
    print(f'{e}:查詢球員發生錯誤')

