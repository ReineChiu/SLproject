import datetime

with open('crontab.txt','a',encoding='utf-8') as file:
    file.write('\n'+str(datetime.datetime.now()))