import React, { type ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
} from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import BottomNavBar from './BottomNavBar'; // Import the new BottomNavBar

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      {/* 
        The SidebarInset component is a "main" element that has a
        margin-left which is equivalent to the width of the sidebar.
      */}
      <div className="flex flex-col min-h-screen md:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:md:ml-[var(--sidebar-width)] transition-[margin-left] duration-200 ease-linear">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6"> {/* Adjusted bottom padding for mobile */}
          {children}
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground border-t hidden md:block"> {/* Hide footer on mobile */}
          ToDoList App © {new Date().getFullYear()}
        </footer>
        <BottomNavBar /> {/* Add BottomNavBar */}
      </div>
    </SidebarProvider>
  );
}
