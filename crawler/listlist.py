import ssl, requests, re
 
from bs4 import BeautifulSoup
from utils.mysql_connect import select_retire, update_retire
from utils.tools import get_table, convert_list

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() #關閉安全請求警告 (搭配import requests)

url="https://www.cpbl.com.tw/player"
headers={
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
        }
response = requests.post(url, headers = headers, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')
# print(soup)
all_name = soup.find_all("dd")
all_name = [name.text for name in all_name]
all_name = [re.sub(r'[#*◎]', '', name) for name in all_name]
# 在all_player名單中不包含上述名字，都視為非現役
results = select_retire(all_name) #找出非現役名單
for result in results:
    # update_retire("非現役", result["id"])