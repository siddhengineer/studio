"use client";
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import CategoryForm from './CategoryForm';
import type { Category } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AddCategoryDialogProps {
  children: React.ReactNode; // For custom trigger
}

export default function AddCategoryDialog({ children }: AddCategoryDialogProps) {
  const { dispatch } = useAppContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: data });
    toast({
      title: "Category Added",
      description: `"${data.name}" has been successfully added.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CategoryForm 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)}
            submitButtonText="Add Category"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
