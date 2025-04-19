
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ValueChangeIndicator } from '@/components/animations/ValueChangeIndicator';
import { usePortfolioSummary } from '@/hooks/usePortfolio';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';

const ProfitLossAnalysis: React.FC = () => {
  const { data: portfolio } = usePortfolioSummary();
  
  const metrics = {
    daily: { value: 2.5, amount: 1250.00 },
    ytd: { value: 15.8, amount: 7900.00 },
    total: { value: 32.4, amount: 16200.00 }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Daily P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline">
            <ValueChangeIndicator value={metrics.daily.value} />
            <span className="text-2xl font-bold">
              <AnimatedCounter value={metrics.daily.amount} prefix="$" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">YTD P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline">
            <ValueChangeIndicator value={metrics.ytd.value} />
            <span className="text-2xl font-bold">
              <AnimatedCounter value={metrics.ytd.amount} prefix="$" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline">
            <ValueChangeIndicator value={metrics.total.value} />
            <span className="text-2xl font-bold">
              <AnimatedCounter value={metrics.total.amount} prefix="$" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossAnalysis;
