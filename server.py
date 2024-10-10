from flask import Flask, request, jsonify
import sqlite3
from argparse import ArgumentParser
import bcrypt  # For hashing and verifying passwords
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Function to open a connection to the SQLite database
def open_database():
    conn = sqlite3.connect('meal.sqlite')
    print("Connected to the database")
    return conn

# Function to create a table to store user data if it doesn't exist
def create_users_table():
    conn = open_database()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Users (
            email TEXT PRIMARY KEY,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Function to hash a password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Function to check if a password matches its hashed version
def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

# Register route
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        conn = open_database()
        cursor = conn.cursor()

        # Check if the email already exists
        cursor.execute("SELECT * FROM Users WHERE email=?", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400

        # Hash the password before storing it
        hashed_password = hash_password(password)

        cursor.execute('''
            INSERT INTO Users (email, password)
            VALUES (?, ?)
        ''', (email, hashed_password))

        conn.commit()
        conn.close()

        response = {'message': 'Registration successful'}
        return jsonify(response), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred'}), 500

# Login route
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        conn = open_database()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Users WHERE email=?", (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({'error': 'User not found'}), 404

        hashed_password = user[1]

        if check_password(password, hashed_password):
            conn.close()
            return jsonify({'message': 'Login successful'}), 200
        else:
            conn.close()
            return jsonify({'error': 'Invalid password'}), 401
    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    create_users_table()

    app.run(host='0.0.0.0', port=port)
