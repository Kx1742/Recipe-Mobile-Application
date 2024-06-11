from flask import Flask, request, jsonify
import sqlite3
from argparse import ArgumentParser
app = Flask(__name__)

# Function to open a connection to the SQLite database
def open_database():
    conn = sqlite3.connect('meal.sqlite')  
    print("Connected to the database")  # Add this line to print a message
    return conn

# Function to create a table to store feedback data if it doesn't exist
def create_feedback_table():
    conn = open_database()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            feedback_type TEXT,
            comments TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        # Get the JSON data from the request
        data = request.json

        # Process and store the feedback data in the database
        name = data.get('name')
        email = data.get('email')
        feedback_type = data.get('feedbackType')
        comments = data.get('comments')

        conn = open_database()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO feedback (name, email, feedback_type, comments)
            VALUES (?, ?, ?, ?)
        ''', (name, email, feedback_type, comments))

        conn.commit()
        conn.close()

        # Return a response to the client
        response = {'message': 'Feedback submitted successfully'}
        return jsonify(response), 200
    except Exception as e:
        # Handle exceptions if something goes wrong
        print(str(e))
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)