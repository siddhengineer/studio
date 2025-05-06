"use client";
import type { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit2, Trash2, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import EditTaskDialog from './EditTaskDialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { dispatch, state } = useAppContext();

  const category = state.categories.find(cat => cat.id === task.categoryId);

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  return (
    <li className={cn("flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors", task.isCompleted && "bg-muted/30")}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onCheckedChange={handleToggleComplete}
          aria-label={task.isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "block text-base font-medium text-foreground cursor-pointer truncate",
              task.isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={cn("text-sm text-muted-foreground truncate", task.isCompleted && "line-through")}>
              {task.description}
            </p>
          )}
           <div className="flex items-center space-x-2 mt-1">
            {task.dueDate && (
              <Badge variant="outline" className={cn("text-xs", task.isCompleted && "border-muted-foreground text-muted-foreground")}>
                <CalendarDays className="h-3 w-3 mr-1" />
                {format(parseISO(task.dueDate), 'MMM d, yyyy HH:mm')}
              </Badge>
            )}
            {category && (
               <Badge variant="secondary" style={{ backgroundColor: task.isCompleted ? '' : category.color }} className={cn("text-xs", task.isCompleted && "!bg-muted text-muted-foreground border-muted-foreground")}>
                {category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="ml-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Task options">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditTaskDialog task={task}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Prevent auto close */}
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </EditTaskDialog>
            <DropdownMenuSeparator />
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                    onSelect={(e) => e.preventDefault()} // Prevent auto close for alert dialog trigger
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task "{task.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
