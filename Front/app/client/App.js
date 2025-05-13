import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Home from '../Home/Home';
import Profil from '../Profil/Profil';
import Stat from '../Stat/Stat';
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }} // Cacher le header par défaut
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }} // Cacher le header
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }} // Cacher le header
                />
                <Stack.Screen
                    name="Profil"
                    component={Profil}
                    options={{ headerShown: false }} // Cacher le header
                />
              <Stack.Screen
                    name="Stat"
                    component={Stat}
                    options={{ headerShown: false }} // Cacher le header
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}