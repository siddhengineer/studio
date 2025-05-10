import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { lightColors, darkColors } from './colors';

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.paperPrimary,
    accent: lightColors.paperAccent, // for older Paper versions, use accent
    onPrimary: lightColors.primaryText,
    background: lightColors.paperBackground,
    surface: lightColors.paperSurface,
    onSurface: lightColors.paperText,
    text: lightColors.paperText, // react-native-paper v4 prop
    error: lightColors.error,
    notification: lightColors.paperNotification,
    // Custom colors from your palette
    card: lightColors.card,
    border: lightColors.border,
    muted: lightColors.muted,
    mutedText: lightColors.mutedText,
    chart1: lightColors.chart1,
    chart2: lightColors.chart2,
    chart3: lightColors.chart3,
    chart4: lightColors.chart4,
    chart5: lightColors.chart5,
  },
};

export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.paperPrimary,
    accent: darkColors.paperAccent, // for older Paper versions
    onPrimary: darkColors.primaryText,
    background: darkColors.paperBackground,
    surface: darkColors.paperSurface,
    onSurface: darkColors.paperText,
    text: darkColors.paperText, // react-native-paper v4 prop
    error: darkColors.error,
    notification: darkColors.paperNotification,
    // Custom colors from your palette
    card: darkColors.card,
    border: darkColors.border,
    muted: darkColors.muted,
    mutedText: darkColors.mutedText,
    chart1: darkColors.chart1,
    chart2: darkColors.chart2,
    chart3: darkColors.chart3,
    chart4: darkColors.chart4,
    chart5: darkColors.chart5,
  },
};

// Type for custom theme colors, if you want to access them directly
export type AppThemeColors = typeof CombinedDefaultTheme.colors & typeof CombinedDarkTheme.colors;

