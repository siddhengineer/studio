"use client";
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import TaskForm from './TaskForm';
import type { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface EditTaskDialogProps {
  task: Task;
  children: React.ReactNode; // For the trigger element
}

export default function EditTaskDialog({ task, children }: EditTaskDialogProps) {
  const { dispatch } = useAppContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => {
    const updatedTask: Task = {
      ...task, // Retain id, isCompleted, createdAt
      ...data, // Apply new title, description, dueDate, categoryId
      updatedAt: new Date().toISOString(), // Update timestamp
    };
    dispatch({ type: 'EDIT_TASK', payload: updatedTask });
    toast({
      title: "Task Updated",
      description: `"${updatedTask.title}" has been successfully updated.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Task</DialogTitle>
          <DialogDescription>
            Modify the details of your task below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            submitButtonText="Save Changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
