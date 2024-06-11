import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, ToastAndroid } from 'react-native';
import { InputWithLabel, AppButton } from '../UI';
import io from 'socket.io-client';
import { Picker } from '@react-native-picker/picker';

const GENDER_OPTIONS = ['Male', 'Female'];

var socket = io.connect('http://192.168.68.114:5000/calories', {
  transports: ['websocket'],
});

export default class CalorieCalculatorScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: '0',
      age: '0',
      gender: 'Male', // Default gender
      activity_level: '0',
      calories: '0',
    };

    socket.on('connect', () => {
      console.log(socket.id);
      socket.emit('client_connected', { connected: true });
      ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('error', (error) => {
      ToastAndroid.show('Failed to connect to the server', ToastAndroid.LONG);
    });

    socket.on('calories_result', (data) => {
      try {
        let result = JSON.parse(data);

        this.setState({
          calories: parseFloat(result.calories).toFixed(2),
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Recipe Calorie Calculator</Text>
        <Text style={styles.description}>
          Calculate the estimated calories in your recipes based on ingredients and servings. Enter the details below:
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <InputWithLabel
            style={styles.input}
            value={this.state.weight}
            onChangeText={(weight) => {
              this.setState({ weight });
            }}
            keyboardType={'numeric'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <InputWithLabel
            style={styles.input}
            value={this.state.age}
            onChangeText={(age) => {
              this.setState({ age });
            }}
            keyboardType={'numeric'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Activity Level 1-10</Text>
          <InputWithLabel
            style={styles.input}
            value={this.state.activity_level}
            onChangeText={(activity_level) => {
              this.setState({ activity_level });
            }}
            keyboardType={'numeric'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            style={styles.picker}
            selectedValue={this.state.gender}
            onValueChange={(gender) => {
              this.setState({ gender });
            }}
          >
            {GENDER_OPTIONS.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <Text style={styles.resultLabel}>Estimated Calories:</Text>
        <Text style={styles.calories}>{this.state.calories} kcal</Text>

        <AppButton
          style={styles.button}
          title={'Calculate'}
          theme={'primary'}
          onPress={() => {
            socket.emit('client_send', {
              weight: parseFloat(this.state.weight),
              age: parseInt(this.state.age),
              gender: this.state.gender,
              activity_level: parseFloat(this.state.activity_level),
            });
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    fontSize: 16,
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  calories: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});
