import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
let SQLite = require('react-native-sqlite-storage');


export default class ViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };

    this.db = SQLite.openDatabase(
      { name: 'recipe.sqlite', createFromLocation: '~recipe.sqlite' },
      this.openCallback,
      this.errorCallback,
    );
  }

  // Function to open the YouTube video link
  openYoutubeLink = (youtubeLink) => {
    if (youtubeLink) {
      Linking.openURL(youtubeLink);
    } else {
      console.warn('YouTube link is missing');
    }
  };

  componentDidMount() {
  }

  _saveToDatabase() {
    const meal = this.props.route.params?.meal;
    const recipeID = meal?.idMeal;
    const recipeName = meal?.strMeal;
    const recipeDescription = meal?.strInstructions;
    const { route } = this.props;
    const email = route.params?.email;

    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM recipe WHERE recipeEmail = ? AND recipeID = ? ',
        [email, recipeID],
        (tx, results) => {
          if (results.rows.length > 0) {
            Alert.alert('Duplicate Add', 'Recipe Already in Bags!!', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
          } else {
            tx.executeSql(
              'INSERT INTO recipe (recipeID, recipeName, recipeEmail, recipeDescription) VALUES (?, ?, ?, ?)',
              [recipeID, recipeName, email, recipeDescription],
              () => {
                Alert.alert('Successfully Added', 'Recipe Added!!', [
                  {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                  },
                ]);
              },
              (error) => {
                console.error('Error inserting new row:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error checking for email in the database:', error);
        }
      );
    });
  }

  render() {
    const meal = this.props.route.params?.meal;

    return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: meal?.strMealThumb }} style={styles.mealImage} />

        <Text style={styles.mealTitle}>{meal?.strMeal || 'No title'}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.text}>{meal?.strCategory || 'No category information'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.text}>{meal?.idMeal || 'No ID information'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Area:</Text>
            <Text style={styles.text}>{meal?.strArea || 'No area information'}</Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.label}>Instructions:</Text>
          {meal?.strInstructions && (
            <View style={styles.stepsContainer}>
              {meal.strInstructions
                .split('\r\n')
                .filter((step) => step.trim() !== '')
                .map((step, index) => (
                  <Text key={index} style={styles.stepText}>
                    {`${index + 1}. ${step}`}
                  </Text>
                ))}
            </View>
          )}
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.label}>Ingredients:</Text>
          {Array.from({ length: 20 }, (_, i) => {
            const ingredient = meal?.[`strIngredient${i + 1}`];
            const measure = meal?.[`strMeasure${i + 1}`];
            return (
              ingredient && (
                <Text key={i} style={styles.ingredientText}>
                  {`${measure ? measure + ' ' : ''}${ingredient}`}
                </Text>
              )
            );
          })}
        </View>

        <Button
          title="Add to Recipes"
          buttonStyle={styles.addButton}
          titleStyle={styles.buttonTitle}
          onPress={() => this._saveToDatabase()}
        />

        {meal?.strYoutube && (
          <TouchableOpacity onPress={() => this.openYoutubeLink(meal.strYoutube)}>
            <Text style={styles.youtubeLink}>Watch on YouTube</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mealImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkblue',
  },
  text: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: '#333',
  },
  youtubeLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  ingredientsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
