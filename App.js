import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/Login/Login';
import Home from './app/Home/Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Cacher le header par défaut
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Cacher le header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
