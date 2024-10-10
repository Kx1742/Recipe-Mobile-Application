import React, { Component } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldEmail: this.props.route.params?.email,
      email: this.props.route.params?.email,
      editMode: false,
      newEmail: '',
    };
    this.db = null; // Initialize the database object
  }

  componentDidMount() {
    // Retrieve the email from AsyncStorage when the component mounts
    this.getEmailFromAsyncStorage();
  }

  getEmailFromAsyncStorage = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    this.setState({ email: storedEmail || '' });
  };

  handleEditEmail = () => {
    this.setState({ editMode: true, newEmail: this.state.email });
  };

  handleSaveEmail = async () => {
    try {
      // Update the email in AsyncStorage
      await AsyncStorage.setItem('email', this.state.newEmail);

      // Open the SQLite database
      this.db = SQLite.openDatabase(
        { name: 'recipe.sqlite', createFromLocation: '~recipe.sqlite' },
        this.openCallback,
        this.errorCallback,
      );
      console.log(this.state.oldEmail);
      // Check if the old email exists in the database
      this.db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM recipe WHERE recipeEmail = ?',
          [this.state.oldEmail],
          (tx, results) => {
            if (results.rows.length > 0) {
              // Update all occurrences of the old email to the new email
              tx.executeSql(
                'UPDATE recipe SET recipeEmail = ? WHERE recipeEmail = ?',
                [this.state.newEmail, this.state.oldEmail],
                (tx, updateResults) => {
                  Alert.alert('Successfully Changed', 'Email updated successfully', [
                    {
                      text: 'OK',
                      onPress: () => console.log('OK Pressed'),
                    },
                  ]);

                  // Update the state with the new email and exit edit mode
                  this.setState({ email: this.state.newEmail, editMode: false, oldEmail: this.state.newEmail});
                }
              );
            } else {
              Alert.alert('Fail Change', 'Email does not exist in the database', [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                },
              ]);
            }
          }
        );
      });

      // Navigate to other screens if needed
      // (You can remove the navigation lines you don't need)
      this.props.navigation.navigate('Own Recipe', { email: this.state.newEmail });
      this.props.navigation.navigate('Update', { email: this.state.newEmail });
      this.props.navigation.navigate('View', { email: this.state.newEmail });
      this.props.navigation.navigate('Recipe', { email: this.state.newEmail });
      this.props.navigation.navigate('Home', { email: this.state.newEmail });
      this.props.navigation.navigate('Profile', { email: this.state.newEmail });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../head.png')} style={styles.profileImage} />
        <Text style={styles.emailLabel}>Email:</Text>
        {this.state.editMode ? (
          <TextInput
            style={styles.emailInput}
            onChangeText={(text) => this.setState({ newEmail: text })}
            value={this.state.newEmail}
            placeholder="Enter new email"
          />
        ) : (
          <Text style={styles.email}>{this.state.oldEmail}</Text>
        )}
        {this.state.editMode ? (
          <Button title="Save" onPress={this.handleSaveEmail} />
        ) : (
          <Button title="Edit Email" onPress={this.handleEditEmail} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  emailLabel: {
    fontSize: 18,
  },
  email: {
    fontSize: 20,
    marginBottom: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
});
