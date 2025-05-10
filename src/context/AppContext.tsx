"use client"; // This directive is not used in React Native but kept for consistency if snippets are reused.
import type { Task, Category, TaskFilter } from '@/types';
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialCategories } from '@/data/initialData'; // Import initial categories

interface AppState {
  tasks: Task[];
  categories: Category[];
  selectedCategoryId: string | null;
  taskFilter: TaskFilter;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'> }
  | { type: 'EDIT_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'EDIT_CATEGORY'; payload: Category } // Added for category editing
  | { type: 'DELETE_CATEGORY'; payload: string } // Added for category deletion
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_TASK_FILTER'; payload: TaskFilter }
  | { type: 'LOAD_DATA'; payload: { tasks: Task[]; categories: Category[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }; // New action for setting theme directly

const initialState: AppState = {
  tasks: [],
  categories: initialCategories,
  selectedCategoryId: null,
  taskFilter: 'active',
  isLoading: true,
  theme: 'light', // Default theme
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  filteredTasks: Task[];
} | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { 
        ...state, 
        tasks: action.payload.tasks, 
        categories: action.payload.categories.length > 0 ? action.payload.categories : initialCategories, // Ensure initial categories if empty
        isLoading: false 
      };
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        dueDate: action.payload.dueDate instanceof Date ? action.payload.dueDate.toISOString() : action.payload.dueDate,
        id: uuidv4(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedTasks = [...state.tasks, newTask];
      AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'EDIT_TASK': {
      const payloadDueDate = action.payload.dueDate;
      const dueDateString = payloadDueDate
        ? (payloadDueDate instanceof Date ? payloadDueDate.toISOString() : payloadDueDate)
        : undefined;

      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? { 
            ...action.payload, 
            dueDate: dueDateString,
            updatedAt: new Date().toISOString() 
        } : task
      );
      AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'TOGGLE_TASK_COMPLETION': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() } : task
      );
      AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'ADD_CATEGORY': {
      const newCategory: Category = { ...action.payload, id: uuidv4() };
      const updatedCategories = [...state.categories, newCategory];
      AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      return { ...state, categories: updatedCategories };
    }
    case 'EDIT_CATEGORY': {
      const updatedCategories = state.categories.map(cat =>
        cat.id === action.payload.id ? action.payload : cat
      );
      AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      return { ...state, categories: updatedCategories };
    }
    case 'DELETE_CATEGORY': {
      // Also update tasks that belong to the deleted category
      const tasksWithClearedCategory = state.tasks.map(task => 
        task.categoryId === action.payload ? { ...task, categoryId: '' } : task // Set to empty or a default category ID
      );
      const updatedCategories = state.categories.filter(cat => cat.id !== action.payload);
      AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      AsyncStorage.setItem('tasks', JSON.stringify(tasksWithClearedCategory));
      return { ...state, categories: updatedCategories, tasks: tasksWithClearedCategory };
    }
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategoryId: action.payload };
    case 'SET_TASK_FILTER':
      return { ...state, taskFilter: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', newTheme);
      return { ...state, theme: newTheme };
    }
    case 'SET_THEME': { // Handle new action
      AsyncStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    }
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedCategories = await AsyncStorage.getItem('categories');
        const storedTheme = await AsyncStorage.getItem('theme') as 'light' | 'dark' | null;
        
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        let categories = storedCategories ? JSON.parse(storedCategories) : initialCategories;
        if (categories.length === 0 && initialCategories.length > 0) {
          categories = initialCategories; // Ensure initial categories are loaded if storage is empty or corrupted
          await AsyncStorage.setItem('categories', JSON.stringify(categories));
        }
        
        dispatch({ type: 'LOAD_DATA', payload: { tasks, categories } });
        
        if (storedTheme && state.theme !== storedTheme) { // Use SET_THEME
           dispatch({ type: 'SET_THEME', payload: storedTheme });
        }

      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
        // Load with initial state in case of error
        dispatch({ type: 'LOAD_DATA', payload: { tasks: [], categories: initialCategories } });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadData();
  }, []); // state.theme removed from dependencies to prevent loop, initial load only

  const getFilteredTasks = useCallback(() => {
    let tasksToFilter = state.tasks;
    if (state.selectedCategoryId) {
      tasksToFilter = tasksToFilter.filter(task => task.categoryId === state.selectedCategoryId);
    }
    switch (state.taskFilter) {
      case 'active':
        return tasksToFilter.filter(task => !task.isCompleted);
      case 'completed':
        return tasksToFilter.filter(task => task.isCompleted);
      case 'all':
      default:
        return tasksToFilter;
    }
  }, [state.tasks, state.selectedCategoryId, state.taskFilter]);

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTasks: getFilteredTasks() }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
