from mysql.connector import Error
from mysql.connector import pooling

import mysql.connector

connection_pool = pooling.MySQLConnectionPool(pool_name = "pynative_pool",
                                              pool_size = 5,
                                              host = "localhost",
                                              user = "root",                           
                                              database = "django",  
                                              password = "80jK%&80",
                                              charset = "utf8")


def select_all_player(name):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        select = "select * from standings_all_player where player_name=%s" 
        value = [name]
        cursor.execute(select, value)
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f'{e}:查詢球員資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def insert_allplayer(data):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        insert = '''
            INSERT INTO standings_all_player
            (player_name,team,num,pos,habits,height,weight,birthday,debut,AQ,Country,o_name,draft,retire) 
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            '''
        for i in range(len(data)):
            values = [data[i]]
            cursor.executemany(insert, values)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:增加資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def select_fielder_player(name, year):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        select = "select * from standings_fielder where fielder_name=%s and year=%s"
        value = [name,year]
        cursor.execute(select, value)
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f'{e}:查詢球員資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def update_fielder(GB,FB,SBP,player_id):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update = ("update standings_fielder set GB=%s, FB=%s, SBP=%s where id=%s")

        value = [GB, FB, SBP, player_id]
        # print(update)
        # print(value)
        cursor.execute(update, value)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:更新資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def insert_fielder(data):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        insert = '''
                INSERT INTO standings_fielder
                (fielder_name,team,year,AVG,GP,PA,AB,RUNS,RBI,Hits,one_base,two_base,three_base,HR,
                TB,EBH,BB,IBB,DB,SO,DP,SBH,SF,SB,CS,OBP,SLG,OPS,GB_FB,player_id,GB,FB,SBP) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
               '''
        # for i in range(len(data)):
        #     values = [data[i]] 
        values = [data] 
        # print(insert)
        # print(values)
        cursor.executemany(insert, values)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:增加資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def select_pitcher_player(name, year, player_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        select = "select * from standings_pitcher where pitcher_name=%s and year=%s and player_id=%s"# and pos='投手'order by id desc limit 1"
        # 判斷這個球員是否有寫入過資料？select * from
        value = [name,year, player_id]
        # print("資料庫",value)
        cursor.execute(select, value)
        result = cursor.fetchone()
        # print(result)
        return result
    except Exception as e:
        print(f'{e}:查詢球員資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def update_pitcher(GB,FB,NO_BB,BS,player_id):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update = ("update standings_pitcher set GB=%s, FB=%s, NO_BB=%s, BS=%s where id=%s")

        value = [GB, FB, NO_BB,BS, player_id]
        print(update)
        print(value)
        # cursor.execute(update, value)
        # connection_object.commit()
    except Exception as e:
        print(f'{e}:更新資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def insert_pitcher(data):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        insert = '''
                INSERT INTO standings_pitcher
                (pitcher_name,team,year,ERA,GP,GS,GF,CG,SHO,Win,Lose,SV,HLD,PA,PC,IP,Hits,HR,
                Runs,ER,BB,IBB,DB,SO,WP,BK,WHIP,GB_FB,player_id,GB,FB,NO_BB,BS) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
               '''
        # for i in range(len(data)):
        values = [data] 
        # print(insert)
        # print(values)
        cursor.executemany(insert, values)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:增加資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def update_retire(data, player_id):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update = ("update standings_all_player set retire=%s where id=%s")

        value = [data, player_id]

        cursor.execute(update, value)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:更新資料失敗')
    finally:
        cursor.close()
        connection_object.close()


def select_retire(name):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        select = "select id from standings_all_player where player_name not in ({0})".format(','.join(['%s']*len(name)))# and pos='投手'order by id desc limit 1"
        
        cursor.execute(select, name)
        result = cursor.fetchall()
        return result
    except Exception as e:
        print(f'{e}:查詢資料失敗')
    finally:
        cursor.close()
        connection_object.close()


def insert_game(data):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        insert = '''
                INSERT INTO standings_game
                (number,date,homeTeam,homeScore,homePitch,guestTeam,guestScore,guestPitch,
                location,winPitch,losePitch,mvp) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
               '''
        # for i in range(len(data)):
        values = [data] 
        # print(insert)
        # print(values)
        cursor.executemany(insert, values)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:寫入比賽資料資料失敗')
    finally:
        cursor.close()
        connection_object.close()

# ========================================================================== //
def select_game(number):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True, buffered=True)
        select = "select * from standings_game where number=%s"
        # 判斷這個球員是否有寫入過資料？select * from
        value = [number]
        # print("資料庫",value)
        cursor.execute(select, value)
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f'{e}:查詢球賽資料失敗')
    finally:
        cursor.close()
        connection_object.close()

def update_game(*args):
    try: 
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update = ("update standings_game set homeScore=%s,homePitch=%s,awayScore=%s,awayPitch=%s,winPitch=%s,losePitch%s where id=%s")

        cursor.execute(update, args)
        connection_object.commit()
    except Exception as e:
        print(f'{e}:更新球賽失敗')
    finally:
        cursor.close()
        connection_object.close()

