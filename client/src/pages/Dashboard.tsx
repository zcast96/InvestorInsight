// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import ProfitLossAnalysis from '@/components/dashboard/ProfitLossAnalysis';
import AssetAllocationChart from '@/components/dashboard/AssetAllocationChart';
import SectorDiversificationChart from '@/components/dashboard/SectorDiversificationChart';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TopHoldings from '@/components/dashboard/TopHoldings';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Portfolio Summary Cards */}
      <PortfolioSummary />
      
      {/* Profit/Loss Analysis */}
      <ProfitLossAnalysis />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AssetAllocationChart />
        <SectorDiversificationChart />
      </div>

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Top Holdings */}
      <TopHoldings />
    </div>
  );
};

export default Dashboard;
