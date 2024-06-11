from flask import Flask
from flask_socketio import SocketIO, emit
import json
import math

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('connect', namespace='/calories')
def handle_connect_calories():
    print('Connected to /calories')

@socketio.on('client_connected', namespace='/calories')
def handle_client_connected_calories(data):
    print('Connection Status: {}'.format(data['connected']))

@socketio.on('client_send', namespace='/calories')
def handle_client_send_calories(data):
    try:
        weight = float(data['weight'])
        age = int(data['age'])
        gender = data['gender']
        activity_level = float(data['activity_level'])

        # Compute BMR (Basal Metabolic Rate)
        if gender == 'male':
            bmr = 88.362 + (13.397 * weight) + (4.799 * age) - (5.677 * age)
        else:
            bmr = 447.593 + (9.247 * weight) + (3.098 * age) - (4.330 * age)

        calorie_intake = bmr * activity_level

        # Emit result to client
        emit('calories_result', json.dumps({'calories': calorie_intake}), namespace='/calories')

    except (ValueError, KeyError) as e:
        emit('calories_result', {'error': 'Invalid data format or missing fields'}, namespace='/calories')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000, debug=True)
