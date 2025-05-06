"use client";
import { useAppContext } from '@/context/AppContext';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter, RotateCcw, CheckCircle2, History } from 'lucide-react';
import AddTaskDialog from './AddTaskDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TaskFilter } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';

export default function TaskList() {
  const { state, dispatch, filteredTasks } = useAppContext();
  const { isLoading, taskFilter, categories, selectedCategoryId } = state;

  const handleFilterChange = (value: TaskFilter) => {
    dispatch({ type: 'SET_TASK_FILTER', payload: value });
  };

  const currentCategoryName = selectedCategoryId 
    ? categories.find(c => c.id === selectedCategoryId)?.name 
    : 'All Tasks';

  const filterIconMap = {
    all: <ListFilter className="h-4 w-4 mr-2" />,
    active: <RotateCcw className="h-4 w-4 mr-2" />,
    completed: <CheckCircle2 className="h-4 w-4 mr-2" />,
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-4 w-4/5 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded-md">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-card border-b p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">{currentCategoryName}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {filteredTasks.length} task(s) {taskFilter !== 'all' ? `(${taskFilter})` : ''}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={taskFilter} onValueChange={(value: TaskFilter) => handleFilterChange(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background">
                <div className="flex items-center">
                  {filterIconMap[taskFilter]}
                  <SelectValue placeholder="Filter tasks" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><ListFilter className="h-4 w-4 mr-2 inline-block"/>All Tasks</SelectItem>
                <SelectItem value="active"><RotateCcw className="h-4 w-4 mr-2 inline-block"/>Active</SelectItem>
                <SelectItem value="completed"><CheckCircle2 className="h-4 w-4 mr-2 inline-block"/>Completed</SelectItem>
              </SelectContent>
            </Select>
            <AddTaskDialog>
              <Button variant="default" className="w-full sm:w-auto">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </AddTaskDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 px-6">
            <Image 
              src="https://picsum.photos/seed/notasks/300/200" 
              alt="No tasks found" 
              width={300} 
              height={200} 
              className="mx-auto mb-6 rounded-lg shadow-md"
              data-ai-hint="empty illustration" 
            />
            <h3 className="text-xl font-medium text-foreground mb-2">No Tasks Yet!</h3>
            <p className="text-muted-foreground mb-4">
              {taskFilter === 'completed' ? "You haven't completed any tasks." : "Looks like your to-do list is empty."}
            </p>
            <AddTaskDialog>
              <Button variant="secondary">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Task
              </Button>
            </AddTaskDialog>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
