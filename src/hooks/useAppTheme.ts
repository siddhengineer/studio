import { useTheme as usePaperTheme } from 'react-native-paper';
import { AppThemeColors } from '@/theme/theme';

// This hook provides typed access to the theme object provided by react-native-paper's PaperProvider.
export const useAppTheme = () => {
  const theme = usePaperTheme();
  // Cast the theme colors to include your custom colors.
  // Make sure AppThemeColors includes all properties from PaperTheme.colors plus your custom ones.
  return { ...theme, colors: theme.colors as AppThemeColors };
};
