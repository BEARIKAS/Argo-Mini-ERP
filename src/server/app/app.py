from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS
import pymysql, signal, sys
import os
from random import randint
from typing import Any
from functools import wraps
import traceback
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

sessions: dict[int, tuple[str, str]] = {}

PYMYSQL_RET_TYPE = list[dict[str, Any]]

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': os.getenv('DB_PASSWORD'),
    'database': 'argo',
    'cursorclass': pymysql.cursors.DictCursor
}

GOALSTATS_COOKIE_NAME: str ='goalstats_cookie'

def get_db_connection():
    conn = pymysql.connect(**DB_CONFIG)
    
    return conn

def execute_select_query(original_query: str, query_params: tuple) -> PYMYSQL_RET_TYPE | Exception:
    try:
        with g.db_conn.cursor() as cursor:
            cursor.execute(original_query, query_params)
            ret_val = cursor.fetchall()
            return ret_val
    except Exception as e:
        return e
    
def check_login(wrapped_fxn):
    @wraps(wrapped_fxn)
    def decorated_fxn(*args, **kwargs):
        cookie = request.cookies.get(GOALSTATS_COOKIE_NAME)

        if not cookie or int(cookie) not in sessions:
            return jsonify(error='Auth reqd'), 401
        
        session_entry = sessions[int(cookie)]
        if not session_entry:
            return jsonify(error='No valid session entry'), 401
        
        g.user_first_name, g.user_email, g.user_id = session_entry

        return wrapped_fxn(*args, **kwargs)

    return decorated_fxn
    

@app.before_request
def before_request():
    g.db_conn = get_db_connection()

@app.teardown_request
def teardown_request(exception=None):
    db_conn = getattr(g, 'db_conn', None)
    if db_conn is not None:
        db_conn.close()

@app.route('/signUp')
def sign_up_user():

    user_first_name: str = request.args.get('user_first_name')
    user_last_name: str = request.args.get('user_last_name')
    user_email: str = request.args.get('user_email')

    original_query = 'INSERT INTO users (User_First_Name, User_Last_Name, User_Email) VALUES (%s, %s, %s)'
    query_params = (user_first_name, user_last_name, user_email)

    try:
        g.db_conn.begin()
        with g.db_conn.cursor() as cursor:
            cursor.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
            cursor.execute(original_query, query_params)
        
        g.db_conn.commit()

        return '', 200
    except:
        return '', 500


@app.route('/login', methods=['GET'])
def login_user():
    input_first_name = request.args.get('user_first_name')
    input_email = request.args.get('user_email')

    user_check_query = 'SELECT User_ID, User_First_Name FROM users WHERE User_Email=%s'

    user_check_query_results = execute_select_query(user_check_query, (input_email))

    if user_check_query_results is Exception:
        return 500
    else:
        if user_check_query_results and input_first_name == user_check_query_results[0]['User_First_Name']:
            response = make_response('', 200)
            session_number: int = randint(0, 1000000)
            while session_number in sessions:
                session_number = randint(0, 1000000)
            response.set_cookie(
                GOALSTATS_COOKIE_NAME,
                str(session_number),
                samesite='Lax',
                max_age=60*60*24
            )
            curr_user_id: int = user_check_query_results[0]['User_ID']
            sessions[session_number] = (input_first_name, input_email, curr_user_id)
            return response
        else:
            return '', 500

@app.route('/logout', methods=['GET'])
@check_login
def logout_user():
    cookie = request.cookies.get(GOALSTATS_COOKIE_NAME)

    response = make_response('', 200)

    response.set_cookie(GOALSTATS_COOKIE_NAME, '', expires=0)

    del sessions[int(cookie)]

    return response



