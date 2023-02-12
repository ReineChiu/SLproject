from standings.models import Player

import ssl, requests, re
 
from bs4 import BeautifulSoup

ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings() #關閉安全請求警告 (搭配import requests)

from django.core.management.base import BaseCommand, CommandError
import datetime

class Command(BaseCommand):
    def handle(self, *args, **options):
        pass

