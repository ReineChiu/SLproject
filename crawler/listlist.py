import ssl, requests, re
 
from bs4 import BeautifulSoup
from utils.mysql_connect import select_retire, update_retire
from utils.tools import get_table, convert_list

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() 

url="https://www.cpbl.com.tw/player"
headers={
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
        }
response = requests.post(url, headers = headers, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')
all_name = soup.find_all("dd")
all_name = [name.text for name in all_name]
all_name = [re.sub(r'[#*◎]', '', name) for name in all_name]
results = select_retire(all_name) 
for result in results:
    pass