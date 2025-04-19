// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSectorDiversification } from '@/hooks/usePortfolio';
import { CHART_COLORS } from '@/lib/constants';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SectorDiversificationChart: React.FC = () => {
  const { data, isLoading, error } = useSectorDiversification();
  
  const chartData: ChartData<'doughnut'> = {
    labels: data?.map(item => item.sector) || [],
    datasets: [
      {
        data: data?.map(item => item.percentage) || [],
        backgroundColor: [
          CHART_COLORS.blue,
          CHART_COLORS.green,
          CHART_COLORS.yellow,
          CHART_COLORS.red,
          CHART_COLORS.indigo,
          CHART_COLORS.gray,
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.formattedValue}%`;
          }
        }
      }
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Sector Diversification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-3 w-3 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Sector Diversification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-danger">Error loading sector diversification data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sector Diversification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container h-[250px]">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((sector, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ 
                  backgroundColor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] 
                }}
              />
              <span className="text-sm text-gray-600">{sector.sector}</span>
              <span className="ml-auto text-sm font-medium">{sector.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorDiversificationChart;
