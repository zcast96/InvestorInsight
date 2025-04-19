// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolioPerformance } from '@/hooks/usePortfolio';
import { CHART_COLORS, PERFORMANCE_PERIODS } from '@/lib/constants';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart: React.FC = () => {
  const [period, setPeriod] = useState<string>('1Y');
  const { data, isLoading, error } = usePortfolioPerformance(period);
  
  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: data?.portfolioData.map(d => d.date) || [],
    datasets: [
      {
        label: 'Your Portfolio',
        data: data?.portfolioData.map(d => d.percentage) || [],
        borderColor: CHART_COLORS.primary,
        backgroundColor: `${CHART_COLORS.primary}20`,
        fill: true,
        tension: 0.3,
      },
      ...(data?.benchmarkData?.SPY ? [{
        label: 'S&P 500',
        data: data.benchmarkData.SPY.map(d => d.percentage),
        borderColor: CHART_COLORS.gray,
        borderDash: [5, 5],
        fill: false,
        tension: 0.3,
      }] : []),
      ...(data?.benchmarkData?.QQQ ? [{
        label: 'NASDAQ',
        data: data.benchmarkData.QQQ.map(d => d.percentage),
        borderColor: CHART_COLORS.secondary,
        borderDash: [5, 5],
        fill: false,
        tension: 0.3,
      }] : []),
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear'
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-wrap items-center justify-between pb-2">
          <CardTitle>Performance vs Benchmarks</CardTitle>
          <div className="flex mt-2 sm:mt-0">
            <Skeleton className="w-16 h-8 mr-2" />
            <Skeleton className="w-16 h-8 mr-2" />
            <Skeleton className="w-16 h-8 mr-2" />
            <Skeleton className="w-16 h-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
          <div className="flex items-center justify-center mt-4 space-x-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance vs Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-danger">Error loading performance data</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate last values for legend
  const portfolioLastValue = data.portfolioData[data.portfolioData.length - 1]?.percentage || 0;
  const spyLastValue = data.benchmarkData.SPY?.[data.benchmarkData.SPY.length - 1]?.percentage || 0;
  const qqqLastValue = data.benchmarkData.QQQ?.[data.benchmarkData.QQQ.length - 1]?.percentage || 0;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-wrap items-center justify-between pb-2">
        <CardTitle>Performance vs Benchmarks</CardTitle>
        <div className="flex mt-2 sm:mt-0">
          {PERFORMANCE_PERIODS.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'ghost'}
              className="px-3 py-1 text-sm ml-2 first:ml-0"
              onClick={() => handlePeriodChange(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="flex flex-wrap items-center justify-center mt-4 space-x-4 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm text-gray-600">Your Portfolio ({portfolioLastValue.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-sm text-gray-600">S&P 500 ({spyLastValue.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
            <span className="text-sm text-gray-600">NASDAQ ({qqqLastValue.toFixed(1)}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
