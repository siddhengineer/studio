
import 'react-native-gesture-handler';
import React from 'react';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { AppProvider } from '@/context/AppContext';
import AppNavigator from '@/navigation/AppNavigator';
import { useColorScheme } from 'react-native';
import { CombinedDarkTheme, CombinedDefaultTheme } from '@/theme/theme';
import Toast from 'react-native-toast-message';

// Adapt react-navigation theme to react-native-paper theme
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export default function App() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <AppProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </AppProvider>
    </PaperProvider>
  );
}
