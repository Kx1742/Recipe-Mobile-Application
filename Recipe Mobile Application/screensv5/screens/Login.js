import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isRegistering: false,
    };
  }

  handleAction = async () => {
    try {
      const { email, password, isRegistering } = this.state;

      // Validate input fields (add your validation logic)
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Prepare data to send to the Python service
      const data = {
        email: email,
        password: password,
      };

      let url = 'http://192.168.0.111:5000/login'; // Default URL

      if (isRegistering) {
        url = 'http://192.168.0.111:5000/register';
      }

      // Call the Python service using fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', responseData.message);
        
        await AsyncStorage.setItem('email', email);
        this.props.navigation.navigate('Own Recipe', { email: email });
        this.props.navigation.navigate('Update', { email: email });
        this.props.navigation.navigate('View', { email: email });
        this.props.navigation.navigate('Recipe', { email: email });
        this.props.navigation.navigate('Home', { email: email });
        this.props.navigation.navigate('Profile', { email: email });
    } else {
        // Action (registration/login) failed, show an error message
        Alert.alert('Error', responseData.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  render() {
    const { isRegistering } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Button title={isRegistering ? 'Register' : 'Login'} onPress={this.handleAction} />
        <Button
          title={isRegistering ? 'Switch to Login' : 'Switch to Register'}
          onPress={() => this.setState({ isRegistering: !isRegistering })}
        />
      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    width: '100%', // Take up full width
  },