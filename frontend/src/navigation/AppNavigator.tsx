import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import AddEditScreen from '../screens/AddEditScreen';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();
//navigation screen
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Reminders' }}
        />
        <Stack.Screen 
            name="AddEdit" 
            component={AddEditScreen} 
            options={({ route }) => ({ title: route.params.reminder ? 'Edit Reminder' : 'New Reminder' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
