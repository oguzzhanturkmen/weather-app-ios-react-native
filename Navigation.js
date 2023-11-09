import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'

const Stack = createNativeStackNavigator();

import { View, Text } from 'react-native'
import React from 'react'

export default function Navigation() {
   return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown : false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}