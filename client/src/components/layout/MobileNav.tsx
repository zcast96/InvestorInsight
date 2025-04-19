// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation, Link } from 'wouter';
import { BarChart3, List, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    return path !== '/' && location.startsWith(path);
  };

  return (
    <div className="block sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={cn(
            "py-3 px-4 flex flex-col items-center",
            isActive('/') ? "text-primary" : "text-gray-500"
          )}>
            <BarChart3 className="mb-1 h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </a>
        </Link>
        <Link href="/holdings">
          <a className={cn(
            "py-3 px-4 flex flex-col items-center",
            isActive('/holdings') ? "text-primary" : "text-gray-500"
          )}>
            <List className="mb-1 h-5 w-5" />
            <span className="text-xs">Holdings</span>
          </a>
        </Link>
        <Link href="/add-transaction">
          <a className={cn(
            "py-3 px-4 flex flex-col items-center",
            isActive('/add-transaction') ? "text-primary" : "text-gray-500"
          )}>
            <PlusCircle className="mb-1 h-5 w-5" />
            <span className="text-xs">Add</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
