import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Search, Sun, Moon, LogOut } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4 md:w-1/3">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md bg-muted pl-9 pr-4"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-muted-foreground">
        
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-[#2a314b]">
            <img src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" alt="User Avatar" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col items-start hidden md:flex">
            <span className="text-sm font-medium leading-none text-white">{user?.name}</span>
            <span className="text-xs text-muted-foreground mt-1">Administrator</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
