export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string for date, can include time
  isCompleted: boolean;
  categoryId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  color?: string; // Optional: for UI theming of categories
}

export type TaskFilter = "all" | "active" | "completed";
