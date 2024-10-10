import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from 'react-native';
let SQLite = require('react-native-sqlite-storage');

export default class UpdateRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      recipe: [],
      recipeIDInput: '',
      recipeNameInput: '',
      recipeDescriptionInput: '',
    };

    this.db = SQLite.openDatabase(
      { name: 'recipe.sqlite'},
      this.openCallback,
      this.errorCallback
    );
  }

  componentDidMount() {
    const { route } = this.props;
    const email = route.params?.email;
    this.setState({ email: email });

    // Get the initial recipe data
    this._query();
  }

  _query() {
    const meal = this.props.route.params?.meal;

    console.log(this.state.email);

    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM recipe WHERE recipeEmail = ?',
        [this.state.email],
        (tx, results) => {
          if (results.rows.length > 0) {
            const recipeData = results.rows.item(0);
            this.setState({
              recipe: recipeData,
              recipeIDInput: recipeData.recipeID.toString(),
              recipeNameInput: recipeData.recipeName,
              recipeDescriptionInput: recipeData.recipeDescription,
            });
          }
        },
        (error) => {
          console.error('Error checking for email in the database:', error);
        }
      );
    });
  }

  _updateRecipe() {
    const { recipeIDInput, recipeNameInput, recipeDescriptionInput } = this.state;

    // Check if any of the input fields is empty
    if (!recipeIDInput || !recipeNameInput || !recipeDescriptionInput) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return; // Don't proceed with the update
    }

    this.db.transaction((tx) => {
      tx.executeSql(
        'UPDATE recipe SET recipeName = ?, recipeDescription = ? WHERE recipeID = ? AND recipeEmail = ?',
        [recipeNameInput, recipeDescriptionInput, recipeIDInput, this.state.email],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Success', 'Recipe updated successfully.');
          } else {
            Alert.alert('Error', 'Failed to update recipe. Please check recipe ID and email.');
          }
        },
        (error) => {
          console.error('Error updating recipe:', error);
        }
      );
    });
  }

  render() {
    const { recipe } = this.state;
    return (
      <View style={styles.container}>
        {recipe.length === 0 ? (
          <Text style={styles.headline}>Empty Recipe! Go add some!</Text>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.headline}>Update Recipe</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipe ID"
              onChangeText={(text) => this.setState({ recipeIDInput: text })}
              value={this.state.recipeIDInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Recipe Name"
              onChangeText={(text) => this.setState({ recipeNameInput: text })}
              value={this.state.recipeNameInput}
            />
            <TextInput
              style={styles.textarea}
              placeholder="Recipe Description"
              onChangeText={(text) =>
                this.setState({ recipeDescriptionInput: text })
              }
              multiline={true}
              numberOfLines={7}
              value={this.state.recipeDescriptionInput}
            />
            <Button
              title="Update Recipe"
              onPress={() => this._updateRecipe()}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
});
