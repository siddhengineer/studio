// React Native Color Palette (approximating the web theme)

// Light Theme Colors
export const lightColors = {
  background: '#F0F4F8', // hsl(210 20% 98%) Light blue-gray
  card: '#F0F4F8', // hsl(210 20% 98%)
  text: '#3A4759', // hsl(220 15% 25%) Dark blue-gray
  primary: '#3A4759', // hsl(220 15% 25%)
  primaryText: '#F0F4F8', // hsl(210 20% 98%)
  secondary: '#E1E8EE', // hsl(210 15% 90%) Lighter blue-gray
  secondaryText: '#3A4759', // hsl(220 15% 25%)
  accent: '#7C4DFF', // hsl(270 60% 55%) Purple
  accentText: '#FFFFFF', // hsl(0 0% 100%) White
  muted: '#E1E8EE', // hsl(210 15% 90%)
  mutedText: '#6D7B8D', // hsl(220 10% 45%) Muted blue-gray
  border: '#D3DCE6', // hsl(210 15% 88%) Light blue-gray border
  error: '#D32F2F', // hsl(0 72% 51%) Red
  errorText: '#F8F9FA', // hsl(0 0% 98%)
  // Chart colors (can be used directly for category colors or UI elements)
  chart1: '#7C4DFF', // Purple
  chart2: '#64B5F6', // Blue-gray variant
  chart3: '#455A64', // Darker blue-gray variant
  chart4: '#AB47BC', // Lighter purple variant
  chart5: '#90A4AE', // Very light blue-gray variant
  // Sidebar (not directly applicable, but can inform tab bar or drawer)
  // For react-native-paper, many of these are derived from primary, accent, background
  // We'll use a simpler mapping for PaperProvider
  paperPrimary: '#3A4759',
  paperAccent: '#7C4DFF',
  paperBackground: '#F0F4F8',
  paperSurface: '#F0F4F8',
  paperText: '#3A4759',
  paperDisabled: 'rgba(58, 71, 89, 0.38)',
  paperPlaceholder: 'rgba(58, 71, 89, 0.54)',
  paperBackdrop: 'rgba(0,0,0,0.5)',
  paperNotification: '#7C4DFF',
};

// Dark Theme Colors
export const darkColors = {
  background: '#1A202C', // hsl(220 15% 10%) Dark blue-gray
  card: '#1A202C', // hsl(220 15% 10%)
  text: '#E2E8F0', // hsl(210 20% 90%) Light blue-gray
  primary: '#E2E8F0', // hsl(210 20% 90%)
  primaryText: '#2D3748', // hsl(220 15% 15%) Darker blue-gray
  secondary: '#2D3748', // hsl(220 15% 20%) Darker blue-gray
  secondaryText: '#E2E8F0', // hsl(210 20% 90%)
  accent: '#9575CD', // hsl(270 70% 65%) Brighter Purple
  accentText: '#FFFFFF', // hsl(0 0% 100%) White
  muted: '#2D3748', // hsl(220 15% 20%)
  mutedText: '#A0AEC0', // hsl(210 15% 60%) Muted light blue-gray
  border: '#4A5568', // hsl(220 15% 25%) Dark blue-gray border
  error: '#EF5350', // hsl(0 60% 45%) Darker Red
  errorText: '#F8F9FA', // hsl(0 0% 98%)
  // Chart colors
  chart1: '#9575CD', // Brighter Purple
  chart2: '#90CAF9', // Light blue-gray variant
  chart3: '#64B5F6', // Blue-gray variant
  chart4: '#CE93D8', // Lighter purple variant
  chart5: '#B0BEC5', // Very light blue-gray variant
  // For react-native-paper
  paperPrimary: '#E2E8F0',
  paperAccent: '#9575CD',
  paperBackground: '#1A202C',
  paperSurface: '#2D3748', // Slightly lighter for cards/surfaces in dark mode
  paperText: '#E2E8F0',
  paperDisabled: 'rgba(226, 232, 240, 0.3)',
  paperPlaceholder: 'rgba(226, 232, 240, 0.5)',
  paperBackdrop: 'rgba(0,0,0,0.5)',
  paperNotification: '#9575CD',
};

// Default Category Colors (can be used if a category doesn't have one)
export const defaultCategoryColors = [
  lightColors.chart1,
  lightColors.chart2,
  lightColors.chart3,
  lightColors.chart4,
  lightColors.chart5,
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple (alternative)
];
