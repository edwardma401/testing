# -*- enconding:etf-8 -*-

import requests
import pymysql

# using for mysql
mysql_url = "127.0.0.1"
username = "root"
password = "Aa20025216"
data_base = "covid-19"


# get connection
def get_conn():
    return pymysql.connect(mysql_url, username, password, data_base)


# get country
def get_country():
    country_data = requests.get("https://api.covid19api.com/countries").json()
    print("get country data is", country_data)
    return country_data


# init data
def insertData():
    country_data = get_country()
    conn = get_conn()
    conn.cursor().execute("delete from data");
    conn.commit()
    for cus in country_data:
        try:
            url = "https://api.covid19api.com/country/" + cus[
                'Slug'] + "?from=2020-01-01T00:00:00Z&to=2020-12-01T00:00:00Z"
            print(url)
            cusRes = requests.get(url).json()
            # insert data to
            if len(cusRes) > 0:
                for data in cusRes:
                    conn = get_conn()
                    sql = "insert into data(country,country_code,province,city,city_code,lat,lon,stat_date,active,Recovered,Deaths,Confirmed) values ('%s','%s','%s','%s','%s','%s','%s','%s',%d,%d,%d,%d)" % (
                        data["Country"],
                        data["CountryCode"],
                        data["Province"],
                        data["City"],
                        data["CityCode"],
                        data["Lat"],
                        data["Lon"],
                        data["Date"],
                        data["Active"],
                        data["Recovered"],
                        data["Deaths"],
                        data["Confirmed"],
                    )
                    print(sql)
                    conn.cursor().execute(sql)
                    conn.commit()
                    conn.close()
        except BaseException as e:
            print("connect error ")
