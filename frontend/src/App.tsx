import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationService from './services/notification';

const App = () => {
  useEffect(() => {
    NotificationService.configure();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
