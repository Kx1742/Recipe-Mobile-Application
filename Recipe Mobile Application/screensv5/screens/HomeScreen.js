import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigationFocus } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
import ImageSlider from './image-slider';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      isFetching: false,
      meals: [],
      categories: [],
      selectedCategory: 'Beef', // Set the default category here
      email: '',
    };
    this.focusListener = null;
  }


  componentDidMount() {
    this._fetchCategories();

    // Add a listener for focus events
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      // Check if the screen is in focus
      if (this.props.isFocused) {
        this.setState({ selectedCategory: 'Beef' }); // Set the default category when screen is in focus
        this._fetchRecipesByCategory('Beef'); // Fetch recipes for the default category
      }
    });
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    //this.focusListener.remove();
  }

  _fetchCategories = () => {
    let url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((response) => {
        if (response.categories) {
          this.setState({ categories: response.categories, selectedCategory: 'Beef' }); // Set the default category here
          this._fetchRecipesByCategory('Beef'); // Fetch recipes for the default category
        } else {
          this.setState({ categories: [], selectedCategory: 'Beef' }); // Set the default category here
          this._fetchRecipesByCategory('Beef'); // Fetch recipes for the default category
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _fetchRecipesByCategory = (category) => {
    let url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category;

    this.setState({ isFetching: true, selectedCategory: category });
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((response) => {
        if (response.meals) {
          this.setState({ meals: response.meals });
        } else {
          this.setState({ meals: [] });
        }
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isFetching: false });
      });
  }

  _load = () => {
    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + this.state.keyword;

    this.setState({ isFetching: true });
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((response) => {
        if (response.meals) {
          this.setState({ meals: response.meals, selectedCategory: '' });
          this.props.navigation.navigate('SecondScreen', {
            meals: this.state.meals,
          });
        } else {
          this.setState({ meals: [], selectedCategory: '' });
        }
        this.setState({ isFetching: false });
        
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isFetching: false });
      });
  }

  _getRecipeToday = () => {
    let url = 'https://www.themealdb.com/api/json/v1/1/random.php';

    this.setState({ isFetching: true });
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((response) => {this.props.navigation.navigate
        if (response.meals) {
          const randomMeal = response.meals[0];
          this.setState({ meals: [randomMeal], selectedCategory: '' }, () => {
            this.props.navigation.navigate('View', {
              meal: randomMeal,
            });
          });
        } else {
          this.setState({ meals: [], selectedCategory: '' });
        }
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isFetching: false });
      });
  }

  _onMealItemPress = (meal) => {
    const mealId = meal.idMeal;
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    this.setState({ isFetching: true });
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then((response) => {
        if (response.meals && response.meals.length > 0) {
          const detailedMeal = response.meals[0];
          this.props.navigation.navigate('View', {
            meal: detailedMeal,
            email : this.props.route.params?.email,
          });
        } else {
          Alert.alert('Error', 'Meal details not found.');
        }
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isFetching: false });
      });
  }
  _onPressButton(buttonText) {
    Alert.alert(`You tapped the "${buttonText}" button!`);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome to Recipe App</Text>
        </View>
        <View style={styles.sliderContainer}>
          <ImageSlider />
        </View>
        <View style={styles.searchContainer}>
          <Ionicons size={30} name="search-outline" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            onChangeText={(keyword) => this.setState({ keyword })}
            placeholder="Search for recipes"
          />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('lightgrey', true, 60)}
            onPress={this._load}
          >
            <View style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View>
          <FlatList
            data={this.state.categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  this._fetchRecipesByCategory(item.strCategory);
                }}
              >
                <Image source={{ uri: item.strCategoryThumb }} style={styles.categoryImage} />
                <Text style={styles.categoryTitle}>{item.strCategory}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.idCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />

          <TouchableOpacity
            style={styles.todayRecipeButton}
            onPress={() => {
              this._getRecipeToday();
            }}
          >
            <Text style={styles.todayRecipeButtonText}>Get Recipe of the Day</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.meals}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mealItem}
              onPress={() => {
                this._onMealItemPress(item);
              }}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
              <Text style={styles.mealTitle}>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.mealList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 30,
    color: 'gray',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  searchButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  todayRecipeButton: {
    padding: 15,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginBottom: 20,
  },
  todayRecipeButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  mealList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  categoryList: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});



export default withNavigationFocus(HomeScreen);
