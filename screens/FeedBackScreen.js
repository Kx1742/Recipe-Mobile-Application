import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      feedbackType: '',
      comments: '',
    };
  }

  handleSubmit = () => {
    // Handle form submission logic here (e.g., send data to a server or store it locally)
    console.log('Name:', this.state.name);
    console.log('Email:', this.state.email);
    console.log('Feedback Type:', this.state.feedbackType);
    console.log('Comments:', this.state.comments);

    // Clear form fields
    this.setState({
      name: '',
      email: '',
      feedbackType: '',
      comments: '',
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
});
