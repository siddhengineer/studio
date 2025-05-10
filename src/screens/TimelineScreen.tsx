import React from 'react';
import { View, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Badge } from 'react-native-paper';
import { format, parseISO, isSameDay } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import type { Task } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface GroupedTask {
  title: string; // This will be the date string
  data: Task[];
}

const TimelineScreen: React.FC = () => {
  const { state } = useAppContext();
  const { tasks, categories, isLoading } = state;
  const { colors } = useAppTheme();

  const getCategoryDetails = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'Uncategorized', color: colors.muted };
  };

  const groupTasksByDate = (tasksToGroup: Task[]): GroupedTask[] => {
    const sortedTasks = [...tasksToGroup].sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
    
    const groups: Record<string, Task[]> = sortedTasks.reduce((acc, task) => {
      const dateKey = format(parseISO(task.createdAt), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return Object.entries(groups).map(([date, tasksOnDate]) => ({
      title: format(parseISO(date), 'EEEE, MMMM do, yyyy'),
      data: tasksOnDate,
    }));
  };

  const groupedTasks = groupTasksByDate(tasks);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  const renderTaskItem = ({ item }: { item: Task }) => {
    const category = getCategoryDetails(item.categoryId);
    return (
      <Card style={[styles.taskCard, { backgroundColor: item.isCompleted ? colors.surface : colors.surface }]} elevation={1}>
        <Card.Content>
          <View style={styles.taskHeader}>
            <Text 
              variant="titleMedium" 
              style={[styles.taskTitle, { color: colors.text }, item.isCompleted && styles.completedText]}
            >
              {item.title}
            </Text>
            {item.isCompleted && (
              <Badge style={[styles.statusBadge, { backgroundColor: colors.primary, alignSelf: 'flex-start' }]} size={18}>
                <Text style={{color: colors.primaryText, fontSize: 10}}>Done</Text>
              </Badge>
            )}
          </View>
          {item.description && (
            <Text 
              variant="bodySmall" 
              style={[styles.taskDescription, { color: colors.mutedText }, item.isCompleted && styles.completedText]}
            >
              {item.description}
            </Text>
          )}
          <View style={styles.taskMeta}>
            <Badge style={[styles.metaBadge, { backgroundColor: category.color || colors.secondary }]}>
              <Text style={{color: category.color ? '#FFFFFF' : colors.secondaryText, fontSize: 10 }}>{category.name}</Text>
            </Badge>
            {item.dueDate && (
              <Badge style={[styles.metaBadge, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                <MaterialCommunityIcons name="calendar-clock" size={10} color={colors.mutedText} style={{marginRight: 3}} />
                <Text style={{color: colors.mutedText, fontSize: 10}}>
                  Due: {format(parseISO(item.dueDate as string), 'MMM d, HH:mm')}
                </Text>
              </Badge>
            )}
            <Badge style={[styles.metaBadge, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
               <MaterialCommunityIcons name="clock-plus-outline" size={10} color={colors.mutedText} style={{marginRight: 3}} />
               <Text style={{color: colors.mutedText, fontSize: 10}}>
                Added: {format(parseISO(item.createdAt), 'HH:mm')}
              </Text>
            </Badge>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScreenWrapper edges={['left', 'right', 'bottom']}>
      {groupedTasks.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="timeline-text-outline" size={64} color={colors.mutedText} />
          <Text variant="titleMedium" style={{ color: colors.mutedText, marginTop: 16 }}>Timeline is empty.</Text>
          <Text variant="bodySmall" style={{ color: colors.mutedText }}>Add tasks to see them here.</Text>
        </View>
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderTaskItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text variant="titleLarge" style={[styles.sectionHeader, { color: colors.primary, borderBottomColor: colors.border }]}>
              {title}
            </Text>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 8,
    // backgroundColor: colors.background, // Handled by ScreenWrapper
    borderBottomWidth: 1,
  },
  taskCard: {
    marginVertical: 6,
    marginHorizontal: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    flex: 1, // Allow title to take space before badge
  },
  statusBadge: {
    marginLeft: 8, // Space between title and badge
    paddingHorizontal: 6,
  },
  taskDescription: {
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  metaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});

export default TimelineScreen;
