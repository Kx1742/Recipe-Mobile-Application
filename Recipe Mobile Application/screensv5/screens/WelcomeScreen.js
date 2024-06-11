import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Login from './Login'; // Import your existing Login component
import stylesheet from './style/stylesheet'; // Adjust the path if needed

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Login/Register'); // Navigate to the Login screen
  };

  return (
      <ImageBackground
        source={require('../background.jpg')}
        style={styles.welcomeBackgroundImage}
        resizeMode="cover"
      >
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Welcome to My Recipe App</Text>
        <TouchableOpacity  style={styles.button}onPress={handleLoginPress}>
          <Text style={stylesheet.welcomeButtonText}>Login</Text>
          <Text style={stylesheet.welcomeButtonText}>Register</Text>
        </TouchableOpacity>
    </View>      
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBackgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  welcomeTitle: {
    verticalAlign: 'top',
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontFamily: 'LobsterTwo',
  },
});
