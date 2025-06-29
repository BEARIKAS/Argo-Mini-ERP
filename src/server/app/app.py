from flask import Flask, jsonify, request, g
from flask_cors import CORS
import pymysql
import os
from typing import Any
from functools import wraps
import jwt
import datetime
import bcrypt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "mysecretkey")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600 * 24  

app = Flask(__name__)
CORS(app, supports_credentials=True)

PYMYSQL_RET_TYPE = list[dict[str, Any]]

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': os.getenv('DB_PASSWORD'),
    'database': 'argo',
    'cursorclass': pymysql.cursors.DictCursor
}

def hash_password(plain_password: str) -> bytes:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def execute_select_query(query: str, params: tuple) -> PYMYSQL_RET_TYPE | Exception:
    try:
        with g.db_conn.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
    except Exception as e:
        return e

def generate_jwt(user_id: int, user_first_name: str, user_email: str) -> str:
    payload = {
        'user_id': user_id,
        'user_first_name': user_first_name,
        'user_email': user_email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def check_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        try:
            token = auth_header.split(" ")[1]  
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            g.user_id = payload['user_id']
            g.user_first_name = payload['user_first_name']
            g.user_email = payload['user_email']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, IndexError):
            return jsonify({'error': 'Invalid or expired token'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.before_request
def before_request():
    g.db_conn = get_db_connection()

@app.teardown_request
def teardown_request(exception=None):
    db_conn = getattr(g, 'db_conn', None)
    if db_conn is not None:
        db_conn.close()

@app.route('/signUp', methods=['POST'])
def sign_up_user():
    data = request.get_json()

    user_first_name = data.get('user_first_name')
    user_last_name = data.get('user_last_name')
    user_email = data.get('user_email')
    user_password = data.get('user_password')

    if not (user_first_name and user_last_name and user_email and user_password):
        return jsonify({'error': 'Missing fields'}), 400

    query = "SELECT User_ID FROM users WHERE User_Email = %s"
    results = execute_select_query(query, (user_email,))
    if isinstance(results, Exception):
        return jsonify({'error': 'Database error'}), 500
    if results:
        return jsonify({'error': 'Email already registered'}), 400

    hashed_password = hash_password(user_password)

    insert_query = """
      INSERT INTO users (User_First_Name, User_Last_Name, User_Email, User_Password) 
      VALUES (%s, %s, %s, %s)
    """
    try:
        with g.db_conn.cursor() as cursor:
            cursor.execute(insert_query, (user_first_name, user_last_name, user_email, hashed_password))
        g.db_conn.commit()
        return '', 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to create user'}), 500

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user_email = data.get('user_email')
    user_password = data.get('user_password')

    if not (user_email and user_password):
        return jsonify({'error': 'Missing fields'}), 400

    query = "SELECT User_ID, User_First_Name, User_Email, User_Password FROM users WHERE User_Email=%s"
    results = execute_select_query(query, (user_email,))

    if isinstance(results, Exception) or len(results) == 0:
        return jsonify({'error': 'Invalid credentials'}), 401

    user_record = results[0]

    stored_hashed_pw = user_record['User_Password']
    if isinstance(stored_hashed_pw, str):
        stored_hashed_pw = stored_hashed_pw.encode('utf-8')

    if not bcrypt.checkpw(user_password.encode('utf-8'), stored_hashed_pw):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_jwt(user_record['User_ID'], user_record['User_First_Name'], user_record['User_Email'])
    return jsonify({'token': token})

# PROTECTED ROUTES IN THE FUTURE EX: 
@app.route('/profile', methods=['GET'])
@check_jwt
def get_profile():
    return jsonify({
        'user_id': g.user_id,
        'user_first_name': g.user_first_name,
        'user_email': g.user_email
    })

if __name__ == '__main__':
    app.run(debug=True)
