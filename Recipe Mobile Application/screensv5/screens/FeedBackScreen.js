import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
let config = require('../Config');
export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      feedbackType: '',
      comments: '',
      isLoading: false, // To track loading state
      feedbackSubmitted: false, // To track if feedback has been submitted
    };
  }

  handleSubmit = () => {
    const { name, email, feedbackType, comments } = this.state;

    // Validate the form fields
    if (!name || !email || !feedbackType || !comments) {
      // Display an error message to the user
      alert('Please fill in all fields');
      return;
    }
// Email validation using regex
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if (!email || !email.match(emailPattern)) {
    // Display an error message to the user for an invalid email format
    alert('Please enter a valid email address');
    return;
  }
    // Create a data object to send to the server (or handle locally)
    const formData = {
      name,
      email,
      feedbackType,
      comments,
    };

    let url = config.settings.serverPath + '/submit-feedback';
    this.setState({isFetching: true});
    // Set loading state while submitting
    

    

    // Send the form data to a server (e.g., using fetch or axios)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle success
          this.setState({
            feedbackSubmitted: true,
            isLoading: false, // Reset loading state
          });
        } else {
          // Handle errors
          this.setState({
            isLoading: false, // Reset loading state
          });
          alert('Error submitting feedback');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({
          isLoading: false, // Reset loading state
        });
        alert('An error occurred while submitting feedback: ' + error.message);
      });
      
  };

  handleReset = () => {
    // Clear form fields
    this.setState({
      name: '',
      email: '',
      feedbackType: '',
      comments: '',
      feedbackSubmitted: false, // Reset feedbackSubmitted flag
    });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Feedback Form</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Feedback Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Feedback Type (e.g., Bug, Suggestion)"
            value={this.state.feedbackType}
            onChangeText={(feedbackType) => this.setState({ feedbackType })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comments</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Comments"
            value={this.state.comments}
            onChangeText={(comments) => this.setState({ comments })}
            multiline={true}
          />
        </View>

        <Button title="Submit" onPress={this.handleSubmit} />
        <Button title="Reset" onPress={this.handleReset} />

        {/* Show a loading indicator while submitting */}
        {this.state.isLoading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Show feedback confirmation */}
        {this.state.feedbackSubmitted && (
          <Text style={styles.feedbackConfirmation}>Feedback submitted successfully!</Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  feedbackConfirmation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
});

