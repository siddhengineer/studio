"use client";
import type { Task, Category, TaskFilter } from '@/types';
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  tasks: Task[];
  categories: Category[];
  selectedCategoryId: string | null;
  taskFilter: TaskFilter;
  isLoading: boolean;
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'> }
  | { type: 'EDIT_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_TASK_FILTER'; payload: TaskFilter }
  | { type: 'LOAD_DATA'; payload: { tasks: Task[]; categories: Category[] } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  tasks: [],
  categories: [
    { id: 'personal', name: 'Personal', color: 'hsl(var(--chart-1))' },
    { id: 'work', name: 'Work', color: 'hsl(var(--chart-2))' },
    { id: 'shopping', name: 'Shopping', color: 'hsl(var(--chart-4))' },
  ],
  selectedCategoryId: null,
  taskFilter: 'active',
  isLoading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  filteredTasks: Task[];
} | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, tasks: action.payload.tasks, categories: action.payload.categories, isLoading: false };
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        // Ensure dueDate is stored as ISO string if it exists
        dueDate: action.payload.dueDate instanceof Date ? action.payload.dueDate.toISOString() : action.payload.dueDate,
        id: uuidv4(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedTasks = [...state.tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'EDIT_TASK': {
      const payloadDueDate = action.payload.dueDate;
      // Ensure dueDate in the payload is converted to ISO string if it's a Date object
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
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'TOGGLE_TASK_COMPLETION': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case 'ADD_CATEGORY': {
      const newCategory: Category = { ...action.payload, id: uuidv4() };
      const updatedCategories = [...state.categories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      return { ...state, categories: updatedCategories };
    }
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategoryId: action.payload };
    case 'SET_TASK_FILTER':
      return { ...state, taskFilter: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const storedTasks = localStorage.getItem('tasks');
      const storedCategories = localStorage.getItem('categories');
      
      const tasks = storedTasks ? JSON.parse(storedTasks) : initialState.tasks;
      // Ensure initial categories are loaded if none in local storage
      const categories = storedCategories ? JSON.parse(storedCategories) : initialState.categories;
      
      dispatch({ type: 'LOAD_DATA', payload: { tasks, categories } });

      // If no categories in local storage, set the initial ones
      if (!storedCategories) {
        localStorage.setItem('categories', JSON.stringify(initialState.categories));
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      dispatch({ type: 'LOAD_DATA', payload: { tasks: initialState.tasks, categories: initialState.categories } });
    }
  }, []);

  const filteredTasks = useCallback(() => {
    let tasks = state.tasks;
    if (state.selectedCategoryId) {
      tasks = tasks.filter(task => task.categoryId === state.selectedCategoryId);
    }
    switch (state.taskFilter) {
      case 'active':
        return tasks.filter(task => !task.isCompleted);
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      case 'all':
      default:
        return tasks;
    }
  }, [state.tasks, state.selectedCategoryId, state.taskFilter]);

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTasks: filteredTasks() }}>
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

