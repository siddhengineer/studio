"use client";
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import AddCategoryDialog from './AddCategoryDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CategoryList() {
  const { state, dispatch } = useAppContext();
  const { categories, tasks } = state;
  const { toast } = useToast();

  const handleDeleteCategory = (categoryId: string) => {
    // Basic deletion: for now, just removes category.
    // In a real app, you'd handle tasks in this category (e.g., reassign, delete, or block deletion if tasks exist).
    // This example will allow deleting even if tasks exist in it. A better UX would be to warn or prevent.
    const tasksInCategory = tasks.filter(task => task.categoryId === categoryId).length;
    if (tasksInCategory > 0) {
       toast({
        title: "Cannot Delete Category",
        description: `Category "${categories.find(c=>c.id === categoryId)?.name}" has ${tasksInCategory} task(s). Please reassign or delete these tasks first. (Functionality to reassign/delete tasks within category not implemented in this basic version). For now, tasks in this category will lose their category association.`,
        variant: "destructive",
        duration: 7000,
      });
      // For now, we'll allow deletion and tasks will become "uncategorized" or default.
      // This part is simplified.
      // dispatch({ type: 'DELETE_CATEGORY', payload: categoryId }); // This action needs to be added to reducer
      // For simplicity, we don't implement DELETE_CATEGORY in reducer for this example.
      // Instead, we'll just show a message.
      return;
    }

    // If we were to implement delete:
    // dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    // toast({
    //   title: "Category Deleted",
    //   description: `Category "${categories.find(c => c.id === categoryId)?.name}" has been deleted.`,
    // });
    toast({
      title: "Deletion Info",
      description: "Category deletion logic is simplified for this demo. Tasks in a deleted category would typically need to be handled (e.g. re-assigned).",
      variant: "default"
    })

  };


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold">Manage Categories</CardTitle>
            <CardDescription>View, add, or manage your task categories.</CardDescription>
          </div>
          <AddCategoryDialog>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add Category
            </Button>
          </AddCategoryDialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {categories.length === 0 ? (
           <div className="text-center py-10">
             <Image 
              src="https://picsum.photos/seed/nocategories/300/200" 
              alt="No categories" 
              width={300} 
              height={200} 
              className="mx-auto mb-6 rounded-lg shadow-md"
              data-ai-hint="empty state" 
            />
            <h3 className="text-xl font-medium text-foreground mb-2">No Categories Yet!</h3>
            <p className="text-muted-foreground mb-4">Create categories to organize your tasks.</p>
            <AddCategoryDialog>
              <Button variant="secondary">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Category
              </Button>
            </AddCategoryDialog>
          </div>
        ) : (
          <ul className="space-y-3">
            {categories.map(category => {
              const taskCount = tasks.filter(task => task.categoryId === category.id).length;
              return (
                <li key={category.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center">
                    <span 
                      className="w-4 h-4 rounded-full mr-3 shrink-0" 
                      style={{ backgroundColor: category.color || 'hsl(var(--muted))' }}
                      aria-label={`Color for ${category.name} category`}
                    />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {taskCount} task{taskCount !== 1 ? 's' : ''}
                    </span>
                    {/* Basic delete button. In a real app, this would need confirmation and task handling. */}
                    {/* 
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category "{category.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Deleting this category will remove it. 
                            Tasks in this category will currently remain but lose their category association. 
                            A full implementation would offer options to reassign or delete tasks.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    */}
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => alert("Category editing/deletion is simplified for this demo.")}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
