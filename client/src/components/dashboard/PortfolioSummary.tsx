// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart2, BarChart } from 'lucide-react';
import { cn, formatCurrency, formatPercentage, getValueColorClass } from '@/lib/utils';
import { usePortfolioSummary } from '@/hooks/usePortfolio';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioSummary: React.FC = () => {
  const { data, isLoading, error } = usePortfolioSummary();
  const [visibleMetrics, setVisibleMetrics] = React.useState({
    totalValue: true,
    gainLoss: true,
    sharpeRatio: true,
    volatility: true
  });

  const toggleMetric = (metric: string) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric as keyof typeof prev]
    }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-danger">Error loading portfolio summary data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {Object.entries(visibleMetrics).map(([metric, isVisible]) => (
          <Button
            key={metric}
            variant={isVisible ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(metric)}
          >
            {metric.replace(/([A-Z])/g, ' $1').trim()}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {visibleMetrics.totalValue && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold mt-2">{formatCurrency(data?.totalValue || 0)}</p>
            <div className="flex items-center mt-2">
              <span className={cn("text-sm flex items-center", getValueColorClass(data?.gainLossPercent || 0))}>
                {data?.gainLossPercent && data.gainLossPercent > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                )}
                {formatPercentage(data?.gainLossPercent || 0)}
              </span>
              <span className="text-xs text-gray-500 ml-2">Today</span>
            </div>
          </CardContent>
        </Card>
        )}

        <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Gain/Loss YTD</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className={cn("text-2xl font-semibold mt-2", getValueColorClass(data?.gainLoss || 0))}>
            {formatCurrency(data?.gainLoss || 0)}
          </p>
          <div className="flex items-center mt-2">
            <span className={cn("text-sm flex items-center", getValueColorClass(data?.gainLossPercent || 0))}>
              {data?.gainLossPercent && data.gainLossPercent > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              )}
              {formatPercentage(data?.gainLossPercent || 0)}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs S&P 500 +8.7%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Sharpe Ratio</h3>
            <BarChart2 className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold mt-2">{data?.sharpeRatio?.toFixed(2) || '0.00'}</p>
          <div className="flex items-center mt-2">
            <span className="text-success text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Good
            </span>
            <span className="text-xs text-gray-500 ml-2">Higher is better</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Volatility</h3>
            <BarChart className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold mt-2">{formatPercentage(data?.volatility || 0)}</p>
          <div className="flex items-center mt-2">
            <span className="text-warning text-sm flex items-center">
              <BarChart className="h-3 w-3 mr-1" />
              Medium
            </span>
            <span className="text-xs text-gray-500 ml-2">Annualized</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
