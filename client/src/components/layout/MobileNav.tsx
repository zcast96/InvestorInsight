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

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
    <Link href={href}>
      <div
        className={cn(
          "py-3 px-4 flex flex-col items-center cursor-pointer",
          isActive(href) ? "text-primary" : "text-gray-500"
        )}
      >
        <Icon className="mb-1 h-5 w-5" />
        <span className="text-xs">{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="block sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <NavItem href="/" icon={BarChart3} label="Dashboard" />
        <NavItem href="/holdings" icon={List} label="Holdings" />
        <NavItem href="/add-transaction" icon={PlusCircle} label="Add" />
      </div>
    </div>
  );
};

export default MobileNav;
