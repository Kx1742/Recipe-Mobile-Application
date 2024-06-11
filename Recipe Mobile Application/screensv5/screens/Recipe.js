import React, {Component} from 'react';
import {Alert, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity,ScrollView,} from 'react-native';
let SQLite = require('react-native-sqlite-storage');

export default class Recipe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipe : [],
    };
    
    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase(
      {name: 'recipe.sqlite', createFromLocation: '~recipe.sqlite'},
      this.openCallback,
      this.errorCallback,
    );
  }

  componentDidMount(){
    this._query();
  }

  _query(){
    const { route } = this.props;

    const meal = this.props.route.params?.meal;
    const email = route.params?.email;
    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM recipe WHERE recipeEmail = ?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            this.setState({recipe: results.rows.raw()});
            this.componentDidMount();

          }
        },
        (error) => {
          console.error('Error checking for email in the database:', error);
        }
      );
    });
  }

  _delete(recipeID, recipeEmail) {
    Alert.alert('Confirm to delete ?', recipeID, [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          this.db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM recipe WHERE recipeID = ? AND recipeEmail = ?',
              [recipeID, recipeEmail],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  // Recipe deleted successfully, refresh the data
                  this.componentDidMount();
                } else {
                  Alert.alert('Error', 'Failed to delete recipe.');
                }
              },
              (error) => {
                console.error('Error deleting recipe:', error);
                this.componentDidMount();

              }
            );
          });
        },
      },
    ]);
  }

    openCallback() {
      console.log('database open success');

    }
    errorCallback(err) {
      console.log('Error in opening the database: ' + err);
    }

    render() {
      const { recipe } = this.state;
      return (
        <ScrollView style={styles.container}>
          {recipe.length === 0 ? (
            <Text style={styles.emptyRecipe}>Empty Recipe</Text>
          ) : (
            recipe.map((item) => (
              <View key={item.recipeID} style={styles.recipeItem}>
                <Text style={styles.recipeTitle}>Recipe ID: {item.recipeID}</Text>
                <Text style={styles.recipeSubtitle}>Name: {item.recipeName}</Text>
                <Text style={styles.recipeSubtitle}>Email: {item.recipeEmail}</Text>
                <Text style={styles.recipeDescription}>Description: {item.recipeDescription}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => this._delete(String(item.recipeID), item.recipeEmail)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light gray background
    padding: 16,
  },
  emptyRecipe: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  recipeItem: {
    backgroundColor: '#fff', // White background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark gray text
  },
  recipeSubtitle: {
    fontSize: 16,
    color: '#555', // Medium gray text
  },
  recipeDescription: {
    fontSize: 16,
    color: '#333', // Dark gray text
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});