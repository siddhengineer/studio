import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput, HelperText, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/context/AppContext';
import type { Category } from '@/types';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { defaultCategoryColors } from '@/theme/colors'; // Import default colors

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name must be 50 characters or less"),
  color: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Must be a valid hex color (e.g. #RRGGBB or #RGB)").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type CategoryFormModalNavigationProp = StackNavigationProp<RootStackParamList, 'AddCategoryModal'>;
type CategoryFormModalRouteProp = RouteProp<RootStackParamList, 'AddCategoryModal'>;

const CategoryFormModal: React.FC = () => {
  const { dispatch } = useAppContext();
  const navigation = useNavigation<CategoryFormModalNavigationProp>();
  const route = useRoute<CategoryFormModalRouteProp>();
  const { colors } = useAppTheme();
  const { toast } = useToast();

  const existingCategory = route.params?.category;

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: existingCategory?.name || '',
      color: existingCategory?.color || defaultCategoryColors[0],
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    navigation.setOptions({ title: existingCategory ? 'Edit Category' : 'Add New Category' });
    if (existingCategory) {
        reset({
            name: existingCategory.name,
            color: existingCategory.color || defaultCategoryColors[0],
        });
    }
  }, [existingCategory, navigation, reset]);

  const onSubmit = (data: CategoryFormData) => {
    try {
      const categoryData = { ...data, color: data.color || defaultCategoryColors[0] };
      if (existingCategory) {
        dispatch({ type: 'EDIT_CATEGORY', payload: { ...existingCategory, ...categoryData } });
        toast({ title: 'Category Updated', description: `"${data.name}" has been updated.` });
      } else {
        dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
        toast({ title: 'Category Added', description: `"${data.name}" has been added.` });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving category:", error);
      Alert.alert("Error", "Could not save category. Please try again.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Category Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.name}
            style={styles.input}
            mode="outlined"
          />
        )}
      />
      {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}

      <Controller
        control={control}
        name="color"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Color (HEX, e.g., #FF5733)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.color}
            style={styles.input}
            mode="outlined"
            right={selectedColor ? <TextInput.Icon icon={() => <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />} /> : null}
          />
        )}
      />
      {errors.color && <HelperText type="error">{errors.color.message}</HelperText>}
      
      <Text style={[styles.label, { color: colors.text }]}>Or pick a default color:</Text>
      <View style={styles.colorPalette}>
        {defaultCategoryColors.map((colorOption) => (
          <TouchableOpacity
            key={colorOption}
            style={[styles.colorSwatch, { backgroundColor: colorOption, borderColor: selectedColor === colorOption ? colors.primary : colors.border }]}
            onPress={() => setValue('color', colorOption, { shouldValidate: true })}
          />
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {existingCategory ? 'Save Changes' : 'Add Category'}
      </Button>
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
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc', // A fixed border for visibility
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    borderWidth: 2,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default CategoryFormModal;
