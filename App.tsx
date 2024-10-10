import React, {Component} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import HomeScreen from './screens/HomeScreen';
import ViewScreen from './screens/ViewScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ChatRoom from './screens/ChatRoom';
import FeedBackScreen from './screens/FeedBackScreen';
import CaloriesScreen from './screens/CaloriesScreen';
import ProfileScreen from './screens/ProfileScreen';
import Recipe from './screens/Recipe';
import Update from './screens/Update';
import OwnRecipe from './screens/OwnRecipe';
import Login from './screens/Login';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => <CustomDrawerComponent {...props}/>}
        >
          <Drawer.Screen 
            name="Home"
            component={HomeScreen}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="home-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}
          />
          <Drawer.Screen
            name="Recipe" // Name of the new screen
            component={Recipe} // Component for the new screen
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="eye-outline" size={20} color={color} /> // Icon for the new screen
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}
          />
          <Drawer.Screen 
            name="Calculate Calories"
            component={CaloriesScreen}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="man-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}  
          />
            <Drawer.Screen 
            name="Own Recipe" // Name of the new screen
            component={OwnRecipe} // Component for the new screen
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="eye-outline" size={20} color={color} /> // Icon for the new screen
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}
          />
          <Drawer.Screen 
            name="Update" // Name of the new screen
            component={Update} // Component for the new screen
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="eye-outline" size={20} color={color} /> // Icon for the new screen
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}
          />
          <Drawer.Screen 
            name="View"
            component={ViewScreen}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="home-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}
          />
          <Drawer.Screen 
            name="Profile"
            component={ProfileScreen}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="man-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }} 
          />
          <Drawer.Screen
            name="FeedBackScreen"
            component={FeedBackScreen}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="man-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}  
          />
          <Drawer.Screen
            name="Login/Register"
            component={Login}
            options={{
              drawerIcon: ({color}) => (
                <Ionicons name="man-outline" size={20} color={color} />
              ),
              drawerLabelStyle:{
                fontSize: 18
              }
            }}  
          />


      


        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

class CustomDrawerComponent extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={{flex:1}}>
        <DrawerContentScrollView>
          <View style={{alignItems:'center', backgroundColor: 'pink'}}>
            <Image
              style={{
                width: 80,
                height: 80
              }}
              source={require('./profile.jpg')}
            />
            <Text>My Profile Picture</Text>
          </View>

          <View style={{backgroundColor: '#fff', flex: 1, paddingTop: 10}}>
            <DrawerItemList {...this.props} />
          </View>
        </DrawerContentScrollView>
      </View>
    );
  }
}

const inputStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //backgroundColor: 'lightblue',
  },
  text: {
    fontSize: 48,
    color: 'black'
  },
  input: {
    textAlign: 'center',
    marginRight: 20
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 10
  }
});

