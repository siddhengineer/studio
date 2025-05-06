"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Settings, ListChecks, PlusCircle } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import AddTaskDialog from '@/components/tasks/AddTaskDialog'; // Will create this
import AddCategoryDialog from '@/components/categories/AddCategoryDialog'; // Will create this
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AppSidebar() {
  const pathname = usePathname();
  const { state, dispatch } = useAppContext();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: LayoutGrid },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <ListChecks className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            ToDoList
          </h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <ScrollArea className="h-[calc(100%-8rem)]"> {/* Adjust height as needed */}
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Categories</span>
            <AddCategoryDialog>
              <Button variant="ghost" size="icon" className="h-6 w-6 group-data-[collapsible=icon]:hidden">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </AddCategoryDialog>
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
               <SidebarMenuButton
                  onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null })}
                  isActive={state.selectedCategoryId === null && pathname === '/'}
                  tooltip={{ children: 'All Tasks', side: 'right', align: 'center' }}
                >
                  <ListChecks />
                  <span>All Tasks</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {state.categories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category.id })}
                  isActive={state.selectedCategoryId === category.id && pathname === '/'}
                  tooltip={{ children: category.name, side: 'right', align: 'center' }}
                >
                  <span className="w-3 h-3 rounded-full mr-1 shrink-0" style={{ backgroundColor: category.color || 'hsl(var(--muted-foreground))' }} />
                  <span>{category.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
         <AddTaskDialog>
            <Button className="w-full group-data-[collapsible=icon]:hidden">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
            </Button>
          </AddTaskDialog>
          <AddTaskDialog>
             <Button variant="outline" size="icon" className="w-full hidden group-data-[collapsible=icon]:flex justify-center">
                <PlusCircle className="h-5 w-5" />
             </Button>
          </AddTaskDialog>
      </SidebarFooter>
    </>
  );
}
