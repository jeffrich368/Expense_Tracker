import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Check this path!
import { ExpenseProvider } from './src/context/ExpenseContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ExpenseProvider>
    </SafeAreaProvider>
  );
}