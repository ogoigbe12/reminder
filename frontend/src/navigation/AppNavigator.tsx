import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AddEditScreen from '../screens/AddEditScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { useAuth, AuthProvider } from '../context/AuthContext';
import NotificationService from '../services/notification';
import { Linking } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.background },
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

const MainStack = () => (
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
);

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['reminderapp://'],
    config: {
        screens: {
            Login: 'login',
            Signup: 'signup',
            Home: 'reminders',
            AddEdit: 'reminders/:id',
        },
    },
    async getInitialURL() {
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();
        if (url != null) {
            return url;
        }

        // Check if app was opened from a notification
        const notificationOpen = await NotificationService.getInitialNotification();
        if (notificationOpen) {
            const { reminderId } = notificationOpen.notification.data || {};
            if (reminderId) {
                return `reminderapp://reminders/${reminderId}`;
            }
        }

        return null;
    },
    subscribe(listener) {
        const onReceiveURL = ({ url }: { url: string }) => listener(url);
        // Listen to incoming links from deep linking
        const subscription = Linking.addEventListener('url', onReceiveURL);

        // Listen to notification clicks while app is in background/foreground
        const unsubscribeNotification = NotificationService.onNotificationOpened((notification) => {
            const { reminderId } = notification.data || {};
            if (reminderId) {
                listener(`reminderapp://reminders/${reminderId}`);
            }
        });

        return () => {
            subscription.remove();
            unsubscribeNotification();
        }; 
    },
};

const NavigationContent = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1,  justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer linking={linking}>
             <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            {isAuthenticated ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

const AppNavigator = () => {
    return (
        <AuthProvider>
            <NavigationContent />
        </AuthProvider>
    );
};

export default AppNavigator;
