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

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer",
          isActive(href) 
            ? "bg-blue-50 text-primary border-l-4 border-primary" 
            : "text-gray-600 border-l-4 border-transparent"
        )}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <aside className="hidden sm:flex flex-col w-56 border-r border-gray-200 bg-white">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-800">Navigation</h2>
      </div>
      <nav className="flex-1">
        <NavItem href="/" icon={BarChart3} label="Dashboard" />
        <NavItem href="/holdings" icon={List} label="Holdings" />
        <NavItem href="/add-transaction" icon={PlusCircle} label="Add Asset" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;
