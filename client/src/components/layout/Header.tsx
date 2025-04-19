// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { useRefreshPortfolioData } from '@/hooks/usePortfolio';

const Header: React.FC = () => {
  const [_, setLocation] = useLocation();
  const refreshPortfolioData = useRefreshPortfolioData();
  
  const handleRefreshData = () => {
    refreshPortfolioData();
  };
  
  const handleOpenSettings = () => {
    setLocation('/settings');
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Portfolio Insight Hub</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefreshData}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleOpenSettings}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
