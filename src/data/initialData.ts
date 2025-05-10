import type { Category } from '@/types';
import { lightColors } from '@/theme/colors'; // Assuming lightColors for default initial display

export const initialCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: lightColors.chart1 },
  { id: 'work', name: 'Work', color: lightColors.chart2 },
  { id: 'shopping', name: 'Shopping', color: lightColors.chart4 },
  { id: 'health', name: 'Health & Fitness', color: lightColors.chart3 },
  { id: 'learning', name: 'Learning', color: lightColors.chart5 },
];
