import decimal
import json
from datetime import datetime

import pymysql
from flask import Flask, render_template, url_for, request, jsonify
import scp_data

app = Flask(__name__)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.strftime("%Y-%m-%d %H:%M:%S")
        if isinstance(o, decimal.Decimal):
            return str(o)
        return json.JSONEncoder.default(self, o)


app.json_encoder = JSONEncoder


# init data
@app.route('/init', methods=['GET'])
def init():
    print('init data')
    scp_data.insertData()
    return 'ok'


@app.route('/country', methods=['GET'])
def country():
    print('get country data')
    conn = scp_data.get_conn()
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cursor.execute("select distinct country  from data")
    data = cursor.fetchall()
    print(data)
    return jsonify(data)


@app.route('/top10/<time>', methods=['GET'])
def top10_time(time):
    print('get top10  data')
    conn = scp_data.get_conn()
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cursor.execute(
        "select country,sum(active) active,sum(Recovered) Recovered,sum(Deaths) Deaths,sum(Confirmed) Confirmed  from data where stat_date=str_to_date('" + time + "','%Y-%m-%d')  group by country order by sum(Confirmed) desc limit 10")
    data = cursor.fetchall()
    print(data)
    return jsonify(data)


@app.route('/all/<time>', methods=['GET'])
def alll(time):
    print('get country data')
    conn = scp_data.get_conn()
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cursor.execute("select *  from data where stat_date=str_to_date('" + time + "','%Y-%m-%d')")
    data = cursor.fetchall()
    print(data)
    return jsonify(data)


@app.route('/getTime', methods=['GET'])
def getTime():
    print('get getTime data')
    conn = scp_data.get_conn()
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cursor.execute("select distinct date_format(stat_date,'%Y-%m-%d') as stat_date from data")
    data = cursor.fetchall()
    print(data)
    return jsonify(data)


@app.route('/line/<country>', methods=['GET'])
def country_data(country):
    conn = scp_data.get_conn()
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cursor.execute(
        "select date_format(stat_date,'%c-%d') as dateTime,sum(active) active,sum(Recovered) Recovered,sum(Deaths) Deaths,sum(Confirmed)  Confirmed from data where country = '" + country + "' group by date_format(stat_date,'%c-%d')")
    data = cursor.fetchall()
    print(data)
    return jsonify(data)


@app.route('/', methods=['GET'])
def index():
    return render_template("world.html")


@app.route('/line.html', methods=['GET'])
def line():
    return render_template("line.html")


@app.route('/top10.html', methods=['GET'])
def top10():
    return render_template("top10.html")


@app.route('/world.html', methods=['GET'])
def world():
    return render_template("world.html")


if __name__ == '__main__':
    app.run(debug=True)
