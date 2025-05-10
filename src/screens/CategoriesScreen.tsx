import React from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, IconButton, useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppContext } from '@/context/AppContext';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddCategoryModal'>;

const CategoriesScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { categories, tasks } = state;
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { colors } = useAppTheme();
  const { toast } = useToast();


  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    const tasksInCategory = tasks.filter(task => task.categoryId === categoryId).length;
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${categoryName}"? ${tasksInCategory > 0 ? `This will also remove the category from ${tasksInCategory} task(s).` : ''}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
            toast({ title: "Category Deleted", description: `"${categoryName}" has been deleted.`});
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => {
    const taskCount = tasks.filter(task => task.categoryId === item.id).length;
    return (
      <Card style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
        <Card.Title
          title={item.name}
          titleStyle={{color: colors.text}}
          subtitle={`${taskCount} task${taskCount !== 1 ? 's' : ''}`}
          subtitleStyle={{color: colors.mutedText}}
          left={(props) => <View {...props} style={[styles.colorIndicator, { backgroundColor: item.color || colors.primary }]} />}
          right={(props) => (
            <View {...props} style={styles.actionsContainer}>
              <IconButton icon="pencil" size={20} onPress={() => navigation.navigate('AddCategoryModal', { category: item })} iconColor={colors.primary} />
              <IconButton icon="delete" size={20} onPress={() => handleDeleteCategory(item.id, item.name)} iconColor={colors.error} />
            </View>
          )}
        />
      </Card>
    );
  };

  return (
    <ScreenWrapper edges={['left', 'right', 'bottom']}>
      {categories.length === 0 ? (
        <View style={styles.centered}>
           <MaterialCommunityIcons name="tag-multiple-outline" size={64} color={colors.mutedText} />
          <Text variant="titleMedium" style={{ color: colors.mutedText, marginTop: 16 }}>No categories yet.</Text>
           <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('AddCategoryModal', {})}
            style={styles.emptyButton}
          >
            Create Your First Category
          </Button>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate('AddCategoryModal', {})}
        color={colors.accentText}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 2,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 16, // Default left padding for Card.Title is 16
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 8,
    paddingBottom: 80, // For FAB
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyButton: {
    marginTop: 20,
  }
});

export default CategoriesScreen;
