
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioSummary } from '@/hooks/usePortfolio';
import { formatCurrency, formatPercentage, getValueColorClass } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const ProfitLossAnalysis: React.FC = () => {
  const { data, isLoading } = usePortfolioSummary();
  
  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Today's P/L</h3>
            <p className={cn("text-2xl font-semibold", getValueColorClass(data?.todayPL || 0))}>
              {formatCurrency(data?.todayPL || 0)}
            </p>
            <span className="text-sm text-gray-500">{formatPercentage(data?.todayPLPercent || 0)} Today</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">YTD P/L</h3>
            <p className={cn("text-2xl font-semibold", getValueColorClass(data?.ytdPL || 0))}>
              {formatCurrency(data?.ytdPL || 0)}
            </p>
            <span className="text-sm text-gray-500">{formatPercentage(data?.ytdPLPercent || 0)} This Year</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Total P/L</h3>
            <p className={cn("text-2xl font-semibold", getValueColorClass(data?.totalPL || 0))}>
              {formatCurrency(data?.totalPL || 0)}
            </p>
            <span className="text-sm text-gray-500">{formatPercentage(data?.totalPLPercent || 0)} All Time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossAnalysis;
