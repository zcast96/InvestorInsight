// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercentage, formatDate, getValueColorClass } from '@/lib/utils';
import { useAsset, useTransactionsByAssetId, useStockQuote, useStockOverview, useStockHistory, useFundamentalMetricsByAssetId } from '@/hooks/useHoldings';
import { ArrowLeft, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
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
  Legend
);

interface HoldingDetailProps {
  id: number;
}

const HoldingDetail: React.FC<HoldingDetailProps> = ({ id }) => {
  const [_, setLocation] = useLocation();
  const [activePeriod, setActivePeriod] = useState<string>('1Y');
  
  const { data: asset, isLoading: isLoadingAsset } = useAsset(id);
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactionsByAssetId(id);
  const { data: quote, isLoading: isLoadingQuote } = useStockQuote(asset?.ticker || null);
  const { data: overview, isLoading: isLoadingOverview } = useStockOverview(asset?.ticker || null);
  const { data: history, isLoading: isLoadingHistory } = useStockHistory(asset?.ticker || null);
  const { data: metrics, isLoading: isLoadingMetrics } = useFundamentalMetricsByAssetId(id);

  const isLoading = isLoadingAsset || isLoadingTransactions || 
                    (asset && !asset.isManual && (isLoadingQuote || isLoadingOverview || isLoadingHistory)) || 
                    isLoadingMetrics;

  const handleNavigateBack = () => {
    setLocation('/holdings');
  };

  const handleAddTransaction = () => {
    setLocation('/add-transaction');
  };

  const handleEditManualMetrics = () => {
    // Open a modal or navigate to metrics edit page
  };

  const chartData: ChartData<'line'> = {
    labels: history?.map(point => formatDate(point.date, 'short')) || [],
    datasets: [
      {
        label: `${asset?.ticker || 'Price'} History`,
        data: history?.map(point => point.close) || [],
        borderColor: '#3B82F6',
        tension: 0.3,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
            return '$' + value;
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
            return `Price: $${context.parsed.y}`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-3" onClick={handleNavigateBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        
        {/* Key Metrics Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Details Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        
        {/* Transactions Skeleton */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2].map(i => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-danger">Asset not found</div>
            <Button className="mt-4" onClick={handleNavigateBack}>
              Back to Holdings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Current values
  const currentPrice = asset.isManual ? 0 : (quote?.price || 0);
  const marketValue = asset.isManual ? 12500 : 24350; // Placeholder
  const gainLoss = asset.isManual ? 0 : 3245.50; // Placeholder
  const gainLossPercent = asset.isManual ? 0 : 15.4; // Placeholder
  const portfolioAllocation = asset.isManual ? 10.0 : 19.6; // Placeholder

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-3" onClick={handleNavigateBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">
          {asset.name} {asset.ticker && `(${asset.ticker})`}
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Market Value</h3>
            <p className="text-2xl font-semibold">{formatCurrency(marketValue)}</p>
            <div className="flex items-center mt-2">
              <span className={getValueColorClass(gainLossPercent) + " text-sm flex items-center"}>
                {gainLossPercent > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                )}
                {formatPercentage(gainLossPercent / 100)}
              </span>
              <span className="text-xs text-gray-500 ml-2">({formatCurrency(gainLoss)})</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Price</h3>
            <p className="text-2xl font-semibold">
              {asset.isManual ? 'N/A' : formatCurrency(currentPrice)}
            </p>
            {!asset.isManual && quote && (
              <div className="flex items-center mt-2">
                <span className={getValueColorClass(quote.change) + " text-sm flex items-center"}>
                  {quote.change > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  {formatCurrency(quote.change)}
                </span>
                <span className="text-xs text-gray-500 ml-2">Today</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Portfolio Allocation</h3>
            <p className="text-2xl font-semibold">{formatPercentage(portfolioAllocation / 100)}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${portfolioAllocation}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holding Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Overview */}
        <Card>
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium text-gray-800">Holding Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Shares</p>
                <p className="text-md font-medium">{asset.isManual ? 'N/A' : '150'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Price</p>
                <p className="text-md font-medium">{asset.isManual ? 'N/A' : '$142.05'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost Basis</p>
                <p className="text-md font-medium">{asset.isManual ? 'N/A' : '$21,307.50'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sector</p>
                <p className="text-md font-medium">{asset.sector || overview?.sector || asset.assetClass}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="text-md font-medium">{transactions && transactions.length > 0 ? 'Multiple' : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-md font-medium">{formatDate(asset.updatedAt, 'medium')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fundamentals */}
        <Card>
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-md font-medium text-gray-800">Fundamental Metrics</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {asset.isManual ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">Fundamental metrics not available for manual assets</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">P/E Ratio</p>
                  <p className="text-md font-medium">{overview?.peRatio || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EPS (TTM)</p>
                  <p className="text-md font-medium">{overview?.eps ? `$${overview.eps}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue Growth (YoY)</p>
                  <p className="text-md font-medium">
                    {metrics?.revenueGrowth ? formatPercentage(Number(metrics.revenueGrowth) / 100) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                  <p className="text-md font-medium">
                    {metrics?.netMargin ? formatPercentage(Number(metrics.netMargin) / 100) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ROE</p>
                  <p className="text-md font-medium">
                    {overview?.roe ? formatPercentage(Number(overview.roe) / 100) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Debt-to-Equity</p>
                  <p className="text-md font-medium">
                    {metrics?.debtToEquity || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dividend Yield</p>
                  <p className="text-md font-medium">
                    {overview?.dividendYield ? formatPercentage(Number(overview.dividendYield) / 100) : 'N/A'}
                  </p>
                </div>
                <div>
                  <Button 
                    variant="link" 
                    className="text-primary text-sm p-0 h-auto" 
                    onClick={handleEditManualMetrics}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit Manual Metrics
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {!asset.isManual && (
        <Card className="mb-6">
          <CardHeader className="flex flex-wrap items-center justify-between pb-2">
            <CardTitle>Price History</CardTitle>
            <div className="flex mt-2 sm:mt-0">
              <Button
                variant={activePeriod === '1Y' ? 'default' : 'ghost'}
                className="px-3 py-1 text-sm"
                onClick={() => setActivePeriod('1Y')}
              >
                1Y
              </Button>
              <Button
                variant={activePeriod === 'YTD' ? 'default' : 'ghost'}
                className="px-3 py-1 text-sm ml-2"
                onClick={() => setActivePeriod('YTD')}
              >
                YTD
              </Button>
              <Button
                variant={activePeriod === '3M' ? 'default' : 'ghost'}
                className="px-3 py-1 text-sm ml-2"
                onClick={() => setActivePeriod('3M')}
              >
                3M
              </Button>
              <Button
                variant={activePeriod === '1M' ? 'default' : 'ghost'}
                className="px-3 py-1 text-sm ml-2"
                onClick={() => setActivePeriod('1M')}
              >
                1M
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {history && history.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No historical data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="mb-6">
        <CardHeader className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-md font-medium text-gray-800">Transaction History</CardTitle>
          <Button 
            variant="link" 
            className="text-primary text-sm font-medium p-0 h-auto flex items-center" 
            onClick={handleAddTransaction}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Transaction
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(transaction.date, 'medium')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 text-right">
                        {Number(transaction.shares).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 text-right">
                        {formatCurrency(Number(transaction.price))}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 text-right">
                        {formatCurrency(Number(transaction.shares) * Number(transaction.price))}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700 h-8 w-8 p-0 mr-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger hover:text-red-700 h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No transactions found. Add a transaction to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HoldingDetail;
