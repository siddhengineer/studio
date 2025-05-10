import React, { type ReactNode } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: object;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

const ScreenWrapper = ({ children, scrollable = false, style, edges = ['top', 'left', 'right'] }: ScreenWrapperProps) => {
  const { colors } = useAppTheme();

  const containerStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const content = (
    <View style={[styles.contentContainer, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={containerStyle} edges={edges}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 16 : 8, // More padding on Android where status bar might not be translucent
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ScreenWrapper;
