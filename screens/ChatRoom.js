import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import io from 'socket.io-client';

var socket = io.connect('http://127.0.0.1:5000/chat', {
    transports: ['websocket'],
});


export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Your Name',
      message: '',
      chatroom: '',
    }

    // When connected, emit a message to the server to inform that this client has connected to the server.
    // Display a Toast to inform user that connection was made.
    socket.on('connect', () => {

        console.log(socket.id); // undefined
        socket.emit('mobile_client_connected', {connected: true});
        ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('connect_to_client', (data) => {
      let greets=JSON.parse(data)
      console.log(greets)
  });

    // Handle connection error
    socket.on('error', (error) => {
        ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
    })

    // Receive chat broadcast from server.
    socket.on('message_broadcast', (data) => {
        console.log(data);
        let messageBag = JSON.parse(data);
      
        this.setState((prevState) => ({
          chatroom: prevState.chatroom + `Message from ${messageBag.sender} at ${messageBag.timestamp}:\n${messageBag.message}\n\n`,
        }));
      });
  }

  render() {
    return (
      <ScrollView style={ styles.container }>
        <TextInput
          style={ styles.input }
          placeholder="Enter name"
          value={ this.state.name }
          selectTextOnFocus ={ true }
          onChangeText={(name) => {this.setState({name})}}
        />
        <TextInput
          style={ styles.output }
          value={ this.state.chatroom }
          multiline={ true }
          editable={ false }
        />
        <TextInput
          style={ styles.input }
          placeholder="Enter message"
          value={ this.state.message }
          selectTextOnFocus ={ true }
          onChangeText={(message) => {this.setState({message})}}
        />
        <TouchableOpacity onPress={() => {
          socket.emit('message_sent', {
              sender: this.state.name,
              message: this.state.message,
          })
        }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </View>
        </TouchableOpacity>
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
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  output: {
    height: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: 'black',
  },
  button: {
    padding: 20,
    backgroundColor: 'blue',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});