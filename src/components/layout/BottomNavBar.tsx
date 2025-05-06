
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

const navItems = [
  { href: '/timeline', label: 'Timeline', icon: History },
  { href: '/', label: 'All Tasks', icon: Home },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { dispatch } = useAppContext();

  const handleHomeClick = () => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null });
    // Optionally, reset filter to 'all' or 'active'
    // dispatch({ type: 'SET_TASK_FILTER', payload: 'all' }); 
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.href === '/' ? handleHomeClick : undefined}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
