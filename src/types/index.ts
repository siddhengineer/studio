export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | Date; // Can be Date object during input, string when stored
  isCompleted: boolean;
  categoryId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  color?: string; // HEX color string
}

export type TaskFilter = "all" | "active" | "completed";

export type RootStackParamList = {
  MainTabs: undefined;
  AddTaskModal: { task?: Task }; // For both add and edit
  AddCategoryModal: { category?: Category }; // For both add and edit
};

export type BottomTabParamList = {
  Home: undefined;
  Timeline: undefined;
  Categories: undefined;
  Settings: undefined;
};
