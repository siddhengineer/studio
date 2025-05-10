import React from 'react';
import { View, StyleSheet, ScrollView, useColorScheme, Platform } from 'react-native';
import { Text, Button, Switch, Card, Divider, List } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { colors } = useAppTheme();
  const systemColorScheme = useColorScheme(); // 'light', 'dark', or null

  const isDarkMode = state.theme === 'dark';

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  // Placeholder for future settings
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [emailUpdates, setEmailUpdates] = React.useState(true);

  return (
    <ScreenWrapper scrollable edges={['left', 'right', 'bottom']}>
      <Card style={styles.card}>
        <Card.Title title="Appearance" titleStyle={{color: colors.text}} />
        <Card.Content>
          <List.Item
            title="Dark Mode"
            titleStyle={{color: colors.text}}
            description={`Currently: ${isDarkMode ? 'On' : 'Off'}`}
            descriptionStyle={{color: colors.mutedText}}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.text} />}
            right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} color={colors.primary}/>}
            onPress={toggleTheme} // Allow pressing the whole item
            style={styles.listItem}
          />
          <Text style={[styles.systemThemeText, {color: colors.mutedText}]}>
            System theme is currently: {systemColorScheme || 'unknown'}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Notifications (Placeholder)" titleStyle={{color: colors.text}} />
        <Card.Content>
          <List.Item
            title="Task Reminders"
            titleStyle={{color: colors.text}}
            description="Receive notifications for due dates"
            descriptionStyle={{color: colors.mutedText}}
            left={props => <List.Icon {...props} icon="bell-ring-outline" color={colors.text} />}
            right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} disabled color={colors.primary}/>}
            style={styles.listItem}
          />
          <List.Item
            title="Email Updates"
            titleStyle={{color: colors.text}}
            description="Get important updates via email"
            descriptionStyle={{color: colors.mutedText}}
            left={props => <List.Icon {...props} icon="email-outline" color={colors.text} />}
            right={() => <Switch value={emailUpdates} onValueChange={setEmailUpdates} disabled color={colors.primary} />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Account (Placeholder)" titleStyle={{color: colors.text}} />
        <Card.Content>
            <List.Item
                title="Username"
                titleStyle={{color: colors.text}}
                description="User123"
                descriptionStyle={{color: colors.mutedText}}
                left={props => <List.Icon {...props} icon="account-circle-outline" color={colors.text} />}
                style={styles.listItem}
            />
             <List.Item
                title="Email"
                titleStyle={{color: colors.text}}
                description="user@example.com"
                descriptionStyle={{color: colors.mutedText}}
                left={props => <List.Icon {...props} icon="email-variant" color={colors.text} />}
                style={styles.listItem}
            />
            <Button mode="outlined" onPress={() => {}} disabled style={styles.profileButton}>
                Edit Profile (Coming Soon)
            </Button>
        </Card.Content>
      </Card>

       <View style={[styles.footerImageContainer, {backgroundColor: colors.surface}]}>
            <MaterialCommunityIcons name="cogs" size={80} color={colors.muted} style={styles.footerImage}/>
            <Text style={[styles.footerText, {color: colors.mutedText}]}>More settings coming soon!</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 2,
  },
  listItem: {
    paddingVertical: Platform.OS === 'android' ? 2 : 8, // Adjust padding for visual balance
  },
  systemThemeText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  profileButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  footerImageContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  footerImage: {
    opacity: 0.5,
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default SettingsScreen;
