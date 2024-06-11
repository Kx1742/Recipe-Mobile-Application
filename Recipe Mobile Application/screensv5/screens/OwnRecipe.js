import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; // Import components from react-native-paper
import SQLite from 'react-native-sqlite-storage';

export default class OwnRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipeID: '',
            recipeName: '',
            recipeDescription: '',
        };
        this.db = SQLite.openDatabase(
            { name: 'recipe.sqlite', createFromLocation: '~recipe.sqlite' },
            this.openCallback,
            this.errorCallback,
        );
    }
a
    _submitRecipe() {
        const { route } = this.props;
        const email = route.params?.email;
        
        // Check for empty inputs
        if (!this.state.recipeID || !this.state.recipeName || !this.state.recipeDescription) {
            Alert.alert('Error', 'Failed to create recipe. Please check recipe ID and description.');
            return;
        } else {
            // Insert data into the SQLite database
            this.db.transaction((tx) => {
                const { recipeID, recipeName, recipeDescription } = this.state;
                tx.executeSql(
                    'INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription) VALUES (?, ?, ?, ?)',
                    [recipeID, recipeName, email, recipeDescription],
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
                    <TextInput
                        label="Recipe ID"
                        value={this.state.recipeID}
                        onChangeText={(text) => this.setState({ recipeID: text })}
                        style={styles.input}
                    />
                    <TextInput
                        label="Recipe Name"
                        value={this.state.recipeName}
                        onChangeText={(text) => this.setState({ recipeName: text })}
                        style={styles.input}
                    />
                    <TextInput
                        label="Recipe Description"
                        value={this.state.recipeDescription}
                        onChangeText={(text) => this.setState({ recipeDescription: text })}
                        multiline
                        style={[styles.input, styles.textArea]}
                    />
                    <Button
                        mode="contained"
                        onPress={() => this._submitRecipe()}
                        style={styles.button}
                    >
                        Submit Recipe
                    </Button>
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
    input: {
        marginBottom: 16,
    },
    textArea: {
        height: 120,
    },
    button: {
        marginTop: 10,
    },
});
