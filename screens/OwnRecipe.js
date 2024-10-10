import React, { Component } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet} from 'react-native';
let SQLite = require('react-native-sqlite-storage');

export default class OwnRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipeID: '',
            recipeName: '',
            recipeDescription: '',
        };
        this.db = SQLite.openDatabase(
            {name: 'recipe.sqlite', createFromLocation: '~recipe.sqlite'},
            this.openCallback,
            this.errorCallback,
          );
    }

    _submitRecipe() {
        const { route } = this.props;
        const email = route.params?.email;
        console.log(email);
        // Check for empty inputs
        if (!this.state.recipeID || !this.state.recipeName || !this.state.recipeDescription) {
            Alert.alert('Error', 'Failed to create recipe. Please check recipe ID and email.');
            return;
        } else {
            console.log(this.state.recipeID, this.state.recipeName, this.state.recipeDescription);
            console.log(email);

            // Insert data into the SQLite database
            this.db.transaction((tx) => {
                const { recipeID, recipeName, recipeDescription } = this.state;
                tx.executeSql(
                'INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription) VALUES (?, ?, ?, ?)',
                [this.state.recipeID, this.state.recipeName, email ,this.state.recipeDescription],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                    // Clear the input fields after successful insertion
                    this.setState({
                        recipeID: '',
                        recipeName: '',
                        recipeDescription: '',
                    });
                    Alert.alert('Success', 'Recipe inserted into the database.');
                    } else {
                    Alert.alert('Error', 'Failed to insert recipe into the database.');
                    }
                },
                (tx, error) => {
                    console.error(error);
                    Alert.alert('Error', 'Failed to insert recipe into the database.');
                }
                );
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Create Own Recipe</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Recipe ID:</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ recipeID: text })}
                        value={this.state.recipeID}
                        maxLength={100}
                        numberOfLines={3}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Recipe Name:</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ recipeName: text })}
                        value={this.state.recipeName}
                        maxLength={100}
                        numberOfLines={3}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Recipe Description:</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ recipeDescription: text })}
                        value={this.state.recipeDescription}
                        maxLength={1000}
                        multiline
                        numberOfLines={7}
                        style={[styles.input, styles.textArea]}
                    />
                    <Button title="Submit Recipe" onPress={() => this._submitRecipe()} />
                    <Text style={styles.message}>{this.state.message}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0', // Light gray background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Dark gray text
    },
    inputContainer: {
        backgroundColor: '#fff', // White background
        padding: 20,
        borderRadius: 8,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.2, // Shadow opacity
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333', // Dark gray text
    },
    input: {
        borderColor: '#ccc', // Light gray border
        borderWidth: 1,
        padding: 10,
        marginBottom: 16,
        borderRadius: 4,
    },
    textArea: {
        height: 120,
    },
    message: {
        fontSize: 16,
        color: 'green', // Green color for success message
        marginTop: 8,
        textAlign: 'center',
    },
});