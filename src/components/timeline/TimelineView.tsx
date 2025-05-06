
"use client";

import { useAppContext } from '@/context/AppContext';
import type { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, isSameDay } from 'date-fns';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CalendarDays, ListChecks, History } from 'lucide-react'; // Added History import

export default function TimelineView() {
  const { state } = useAppContext();
  const { tasks, categories } = state;

  const sortedTasks = [...tasks].sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Uncategorized';
  };
  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color;
  };

  const groupTasksByDate = (tasksToGroup: Task[]) => {
    return tasksToGroup.reduce((acc, task) => {
      const dateKey = format(parseISO(task.createdAt), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  };

  const groupedTasks = groupTasksByDate(sortedTasks);

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl font-semibold">Task Timeline</CardTitle>
            <CardDescription>Tasks ordered by creation date (newest first).</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-10">
            <Image
              src="https://picsum.photos/seed/timelineempty/300/200"
              alt="No tasks in timeline"
              width={300}
              height={200}
              className="mx-auto mb-6 rounded-lg shadow-md"
              data-ai-hint="empty calendar"
            />
            <h3 className="text-xl font-medium text-foreground mb-2">Timeline is Empty</h3>
            <p className="text-muted-foreground">Add some tasks to see them here!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([date, tasksOnDate]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-primary mb-3 pb-1 border-b border-primary/20">
                  {format(parseISO(date), 'EEEE, MMMM do, yyyy')}
                </h3>
                <ul className="space-y-4">
                  {tasksOnDate.map(task => (
                    <li key={task.id} className={cn(
                      "p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow",
                      task.isCompleted ? "bg-muted/40" : "bg-card"
                    )}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={cn(
                            "font-medium text-foreground",
                            task.isCompleted && "line-through text-muted-foreground"
                          )}>{task.title}</h4>
                          {task.description && <p className={cn("text-sm text-muted-foreground mt-1", task.isCompleted && "line-through")}>{task.description}</p>}
                        </div>
                        {task.isCompleted && <Badge variant="outline" className="text-xs shrink-0 ml-2 border-green-500 text-green-600 bg-green-50">Completed</Badge>}
                      </div>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" style={{ backgroundColor: task.isCompleted ? '' : getCategoryColor(task.categoryId) }} className={cn(task.isCompleted && "!bg-muted text-muted-foreground border-muted-foreground")}>
                          {getCategoryName(task.categoryId)}
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline" className={cn(task.isCompleted && "border-muted-foreground text-muted-foreground")}>
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Due: {format(parseISO(task.dueDate), 'MMM d, HH:mm')}
                          </Badge>
                        )}
                         <Badge variant="outline" className={cn(task.isCompleted && "border-muted-foreground text-muted-foreground")}>
                            <ListChecks className="h-3 w-3 mr-1" />
                            Added: {format(parseISO(task.createdAt), 'HH:mm')}
                          </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

