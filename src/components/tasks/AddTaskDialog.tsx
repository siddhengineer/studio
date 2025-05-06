"use client";
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import TaskForm from './TaskForm';
import type { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // Keep this if needed for the trigger
import { useToast } from '@/hooks/use-toast'; // For showing notifications
import { PlusCircle } from 'lucide-react';

interface AddTaskDialogProps {
  children: React.ReactNode; // To use custom trigger components
}

export default function AddTaskDialog({ children }: AddTaskDialogProps) {
  const { dispatch } = useAppContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: data });
    toast({
      title: "Task Added",
      description: `"${data.title}" has been successfully added.`,
      variant: "default",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TaskForm 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)}
            submitButtonText="Add Task"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
