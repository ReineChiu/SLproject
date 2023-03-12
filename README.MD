# <font color=#e7d48b>StoveLeague</font>
以中華職棒官網作為資料根據、爬取，建置提供臺灣職業棒球選手資料圖表化，易於比較選手間的數值，定時更新官網數據提供賽事預告以及比賽數據結果。

## Demo  
player comparison  
- Schedule data updates using crontab.
![Alt text](static/images/search.gif)  
 
scending 
![Alt text](static/images/scending.gif)


[Backend Technique](#backend-technique)  
- [Environment](#environment)  
- [Database](#database)  
- [Cloud Services](#cloud-services)  
- [Version Control](#version-control)  
- [Development Tools](#development-tools)  

[Architecture](#architecture)  
[Data Pipeline](#data-pipeline)  

## Backend Technique

### Environment
- Use **<font color=#008000>django</font>** as server framework. 
  - MVC  
  - ORM  
  - CSRF 
- Use **<font color=#008000>Python</font>** & urllib package for web scraping.  
  - crontab  
  - dotenv 
- Adapt AJAX which sends requests to the **<font color=#008000>RESTful API</font>**-designed backend.
### Database  
- Store web scraping data into AWS RDS **<font color=#008000>MySQL</font>**.Using the index and normalized MySQL to improve query efficiency. 
### Cloud Services  
- AWS EC2  
- AWS RDS  
- Store files in **<font color=#008000>AWS S3</font>** and using **<font color=#008000>CloudFront</font>** to accelerate file access. 
### Version Control
- Git / GitHub  
### Development Tools  
- Deploy the website by **<font color=#008000>Docker</font>**.
- Use **<font color=#008000>Nginx</font>** reverse proxy to establish a more secure HTTPS connection.   
- SSL 
- Domain Name System
## Frontend Technique  
- HTML  
- CSS  
- JS    
- Bootstrap  
- Chart.js  

## Architecture
![Alt text](static/images/arichite.png)

## Data Pipeline 處理資料流程示意圖 
![Alt text](static/images/datapipline.png)  

## Database Schema  
![Alt text](static/images/django-database.png)  
![Alt text](static/images/sl-database.png)