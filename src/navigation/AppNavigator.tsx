import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '@/screens/HomeScreen';
import TimelineScreen from '@/screens/TimelineScreen';
import CategoriesScreen from '@/screens/CategoriesScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import TaskFormModal from '@/screens/TaskFormModal';
import CategoryFormModal from '@/screens/CategoryFormModal';

import { useAppTheme } from '@/hooks/useAppTheme';
import type { RootStackParamList, BottomTabParamList } from '@/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function BottomTabNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Timeline') {
            iconName = focused ? 'timeline-check' : 'timeline-check-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'format-list-bulleted-type' : 'format-list-bulleted';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.background, shadowColor: colors.border },
        headerTitleStyle: { color: colors.text },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Tasks" }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useAppTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Modals will have their own headers or be fullscreen
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="AddTaskModal"
        component={TaskFormModal}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Add/Edit Task', // Title will be dynamic in the component
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="AddCategoryModal"
        component={CategoryFormModal}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Add/Edit Category', // Title will be dynamic
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
}
