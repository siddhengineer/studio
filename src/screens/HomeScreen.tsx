import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, SegmentedButtons, FAB, Portal, Provider as PaperProvider, Menu } from 'react-native-paper';
import { useAppContext } from '@/context/AppContext';
import TaskItem from '@/components/tasks/TaskItem';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, TaskFilter as TaskFilterType } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTaskModal'>;

const HomeScreen: React.FC = () => {
  const { state, dispatch, filteredTasks } = useAppContext();
  const { isLoading, taskFilter, categories, selectedCategoryId } = state;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const handleFilterChange = (value: string) => {
    dispatch({ type: 'SET_TASK_FILTER', payload: value as TaskFilterType });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
    setCategoryMenuVisible(false);
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategoryId);
  const headerTitle = currentCategory ? currentCategory.name : 'All Tasks';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <Button 
              onPress={() => setCategoryMenuVisible(true)} 
              textColor={colors.text}
              icon={() => <MaterialCommunityIcons name={currentCategory?.color ? "circle-slice-8" : "format-list-bulleted"} color={currentCategory?.color || colors.text} size={16} />}
            >
              {headerTitle}
            </Button>
          }
          contentStyle={{backgroundColor: colors.surface}}
        >
          <Menu.Item 
            onPress={() => handleCategorySelect(null)} 
            title="All Tasks" 
            titleStyle={{color: colors.text}}
            leadingIcon={() => <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.text} />}
          />
          {categories.map(cat => (
            <Menu.Item 
              key={cat.id} 
              onPress={() => handleCategorySelect(cat.id)} 
              title={cat.name}
              titleStyle={{color: colors.text}}
              leadingIcon={() => <MaterialCommunityIcons name="circle-slice-8" size={20} color={cat.color || colors.text} />}
            />
          ))}
        </Menu>
      ),
    });
  }, [navigation, headerTitle, categoryMenuVisible, categories, colors, currentCategory]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <PaperProvider>
      <ScreenWrapper edges={['left', 'right', 'bottom']}>
        <SegmentedButtons
          value={taskFilter}
          onValueChange={handleFilterChange}
          style={styles.filterButtons}
          buttons={[
            { value: 'active', label: 'Active', icon: 'clock-outline' },
            { value: 'completed', label: 'Completed', icon: 'check-circle-outline' },
            { value: 'all', label: 'All', icon: 'format-list-bulleted' },
          ]}
        />
        {filteredTasks.length === 0 ? (
          <View style={styles.centered}>
            <MaterialCommunityIcons name="format-list-checks" size={64} color={colors.mutedText} />
            <Text variant="titleMedium" style={{ color: colors.mutedText, marginTop: 16 }}>
              No tasks here.
            </Text>
            <Button
              mode="contained-tonal"
              onPress={() => navigation.navigate('AddTaskModal', {})}
              style={styles.emptyButton}
            >
              Add Your First Task
            </Button>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={({ item }) => <TaskItem task={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Portal>
          <FAB
            icon="plus"
            style={[styles.fab, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('AddTaskModal', {})}
            color={colors.accentText}
          />
        </Portal>
      </ScreenWrapper>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtons: {
    marginVertical: 12,
    marginHorizontal: 2,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
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

export default HomeScreen;
