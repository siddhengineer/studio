
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Checkbox, IconButton, Badge } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import type { Task } from '@/types';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface TaskItemProps {
  task: Task;
}

type TaskItemNavigationProp = StackNavigationProp<RootStackParamList, 'AddTaskModal'>;

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { state, dispatch } = useAppContext();
  const { categories } = state;
  const navigation = useNavigation<TaskItemNavigationProp>();
  const { colors } = useAppTheme();
  const { toast } = useToast();

  const category = categories.find(cat => cat.id === task.categoryId);

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task.id });
    toast({
        title: task.isCompleted ? 'Task Marked Active' : 'Task Completed!',
        description: `"${task.title}" status updated.`,
        type: task.isCompleted ? 'info' : 'success'
    });
  };

  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            toast({ title: "Task Deleted", description: `"${task.title}" has been removed.`, type: 'error' });
          },
          style: "destructive"
        }
      ]
    );
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.surface },
    task.isCompleted && { opacity: 0.7 }
  ];
  
  const textStyle = [
    { color: colors.text },
    task.isCompleted && styles.completedText
  ];
  
  const mutedTextStyle = [
    { color: colors.mutedText },
    task.isCompleted && styles.completedText
  ];


  return (
    <Card style={cardStyle} elevation={1}>
      <View style={styles.cardContentWrapper}>
        <Checkbox.Android
          status={task.isCompleted ? 'checked' : 'unchecked'}
          onPress={handleToggleComplete}
          color={colors.primary}
        />
        <View style={styles.taskInfoContainer}>
          <Text variant="titleMedium" style={textStyle}>{task.title}</Text>
          {task.description ? (
            <Text variant="bodySmall" style={mutedTextStyle} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          <View style={styles.metaContainer}>
            {category && (
              <Badge style={[styles.badge, { backgroundColor: category.color || colors.secondary }]} size={18}>
                <Text style={{color: category.color ? '#FFFFFF' : colors.secondaryText, fontSize: 10}}>{category.name}</Text>
              </Badge>
            )}
            {task.dueDate && (
               <Badge style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]} size={18}>
                <MaterialCommunityIcons name="calendar-clock" size={10} color={colors.mutedText} style={{marginRight: 3}}/>
                <Text style={{fontSize: 10, color: colors.mutedText}}>
                  {format(parseISO(task.dueDate as string), 'MMM d, HH:mm')}
                </Text>
              </Badge>
            )}
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AddTaskModal', { task })}
            iconColor={colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={handleDeleteTask}
            iconColor={colors.error}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 2,
  },
  cardContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8, // Space for actions
    paddingLeft: 2,
    paddingVertical: 8,
  },
  taskInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'column', // Stack edit/delete vertically
  },
  completedText: {
    textDecorationLine: 'line-through',
    // color is handled by opacity on card and direct style on text
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    marginRight: 6,
    marginBottom: 4, // For wrapping
    paddingHorizontal: 6, // Ensures text fits well
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TaskItem;
