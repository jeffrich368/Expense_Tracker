import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tailwind from 'twrnc';

// Screen Imports
import Home from '../screens/Home';
import Create from '../screens/Create';
import Insights from '../screens/Insights';
import Category from '../screens/Category';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyTabs = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarShowLabel: true,
        tabBarLabelStyle: tailwind`text-[10px] font-bold mb-1`,
        tabBarStyle: { 
          height: Platform.OS === 'ios' ? 88 : 68, 
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 0,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={Insights} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={Create} 
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="BottomTabs" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen 
        name="Category" 
        component={Category} 
        options={{ 
          presentation: 'modal',
          headerShown: false, // This removes the "Choose Category" system header
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack.Navigator>
  );
}