import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, HelperText, Text, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/context/AppContext';
import type { Task, Category } from '@/types';
import CustomDateTimePicker from '@/components/common/DateTimePicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  dueDate: z.date().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;
type TaskFormModalNavigationProp = StackNavigationProp<RootStackParamList, 'AddTaskModal'>;
type TaskFormModalRouteProp = RouteProp<RootStackParamList, 'AddTaskModal'>;

const TaskFormModal: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { categories } = state;
  const navigation = useNavigation<TaskFormModalNavigationProp>();
  const route = useRoute<TaskFormModalRouteProp>();
  const { colors } = useAppTheme();
  const { toast } = useToast();

  const existingTask = route.params?.task;

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
      dueDate: existingTask?.dueDate ? new Date(existingTask.dueDate as string) : undefined,
      categoryId: existingTask?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: existingTask ? 'Edit Task' : 'Add New Task' });
    if (existingTask) {
        reset({
            title: existingTask.title,
            description: existingTask.description || '',
            dueDate: existingTask.dueDate ? new Date(existingTask.dueDate as string) : undefined,
            categoryId: existingTask.categoryId,
        });
    } else if (categories.length > 0) {
        setValue('categoryId', categories[0].id);
    }
  }, [existingTask, navigation, categories, reset, setValue]);


  const onSubmit = (data: TaskFormData) => {
    try {
      if (existingTask) {
        const updatedTask: Task = {
          ...existingTask,
          ...data,
          dueDate: data.dueDate, // Keep as Date object or string as per type
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'EDIT_TASK', payload: updatedTask });
        toast({ title: 'Task Updated', description: `"${data.title}" has been updated.` });
      } else {
        dispatch({ type: 'ADD_TASK', payload: data });
        toast({ title: 'Task Added', description: `"${data.title}" has been added.` });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", "Could not save task. Please try again.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Title"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.title}
            style={styles.input}
            mode="outlined"
          />
        )}
      />
      {errors.title && <HelperText type="error">{errors.title.message}</HelperText>}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.description}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
        )}
      />
      {errors.description && <HelperText type="error">{errors.description.message}</HelperText>}

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <CustomDateTimePicker
            label="Due Date (Optional)"
            date={value}
            onDateChange={onChange}
            mode="datetime"
          />
        )}
      />
      {errors.dueDate && <HelperText type="error">{errors.dueDate.message}</HelperText>}
      
      <Text style={[styles.pickerLabel, {color: colors.text}]}>Category</Text>
      <View style={[styles.pickerContainer, {borderColor: errors.categoryId ? colors.error : colors.border, backgroundColor: colors.surface }]}>
        <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={[styles.picker, {color: colors.text}]}
                dropdownIconColor={colors.text}
            >
                {categories.length === 0 && <Picker.Item label="No categories available" value="" enabled={false} />}
                {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} color={colors.text} />
                ))}
            </Picker>
            )}
        />
      </View>
      {errors.categoryId && <HelperText type="error">{errors.categoryId.message}</HelperText>}


      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting || categories.length === 0}
      >
        {existingTask ? 'Save Changes' : 'Add Task'}
      </Button>
      {categories.length === 0 && <HelperText type="error">Please add a category first.</HelperText>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  pickerLabel: {
    fontSize: 12, // Matches Paper label
    marginBottom: 4,
    marginLeft: 4, // Slight indent
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
});

export default TaskFormModal;
