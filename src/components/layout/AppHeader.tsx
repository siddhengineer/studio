"use client";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/components/ui/sidebar'; // Correct hook for sidebar toggle

export default function AppHeader() {
  const { setTheme, theme } = useTheme();
  const { isMobile, toggleSidebar } = useSidebar(); // Get sidebar context

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {isMobile && ( // Show SidebarTrigger only on mobile
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        <div className="mr-4 hidden md:flex">
          {/* Desktop Sidebar Trigger, if you want one here outside the main sidebar component */}
          {/* <SidebarTrigger />  */}
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <h1 className="text-xl font-bold text-foreground md:hidden">ToDoList</h1>
          <div className="flex-grow md:flex-grow-0"></div> {/* Pushes theme toggle to the right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  );
}
