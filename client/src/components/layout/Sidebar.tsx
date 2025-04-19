// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation, Link } from 'wouter';
import { BarChart3, List, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    return path !== '/' && location.startsWith(path);
  };

  return (
    <aside className="hidden sm:flex flex-col w-56 border-r border-gray-200 bg-white">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-800">Navigation</h2>
      </div>
      <nav className="flex-1">
        <Link href="/">
          <a className={cn(
            "flex items-center px-4 py-3 hover:bg-gray-50",
            isActive('/') 
              ? "bg-blue-50 text-primary border-l-4 border-primary" 
              : "text-gray-600 border-l-4 border-transparent"
          )}>
            <BarChart3 className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </a>
        </Link>
        <Link href="/holdings">
          <a className={cn(
            "flex items-center px-4 py-3 hover:bg-gray-50",
            isActive('/holdings') 
              ? "bg-blue-50 text-primary border-l-4 border-primary" 
              : "text-gray-600 border-l-4 border-transparent"
          )}>
            <List className="w-5 h-5 mr-3" />
            <span>Holdings</span>
          </a>
        </Link>
        <Link href="/add-transaction">
          <a className={cn(
            "flex items-center px-4 py-3 hover:bg-gray-50",
            isActive('/add-transaction') 
              ? "bg-blue-50 text-primary border-l-4 border-primary" 
              : "text-gray-600 border-l-4 border-transparent"
          )}>
            <PlusCircle className="w-5 h-5 mr-3" />
            <span>Add Asset</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn(
            "flex items-center px-4 py-3 hover:bg-gray-50",
            isActive('/settings') 
              ? "bg-blue-50 text-primary border-l-4 border-primary" 
              : "text-gray-600 border-l-4 border-transparent"
          )}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
