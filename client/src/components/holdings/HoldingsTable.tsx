// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState } from 'react';
import { useLocation } from 'wouter';
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
import { 
  Edit, 
  Trash2, 
  DollarSign,
  ArrowUp,
  ArrowDown 
} from 'lucide-react';
import { useAssets, useStockQuote } from '@/hooks/useHoldings';
import { useManualAssetValuesByAssetId } from '@/hooks/useHoldings';
import { formatCurrency, formatPercentage, getValueColorClass } from '@/lib/utils';
import { Asset, StockQuote, ManualAssetValue } from '@/lib/types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ExtendedAsset = Asset & {
  currentPrice?: number;
  marketValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  percentOfPortfolio?: number;
  shares?: number;
  avgPrice?: number;
};

const HoldingsTable: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [assetFilter, setAssetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: assets, isLoading, error } = useAssets();

  const enrichedAssets: ExtendedAsset[] = assets?.map(asset => {
    // Start with base asset data
    const enrichedAsset: ExtendedAsset = { ...asset };
    return enrichedAsset;
  }) || [];

  // Filter assets
  const filteredAssets = enrichedAssets.filter(asset => {
    // Apply asset class filter
    if (assetFilter !== 'all' && asset.assetClass !== assetFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(query) ||
        (asset.ticker && asset.ticker.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.marketValue || 0) - (a.marketValue || 0);
      case 'performance':
        return (b.gainLossPercent || 0) - (a.gainLossPercent || 0);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleView = (id: number) => {
    setLocation(`/holdings/${id}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Shares/Units</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">% of Portfolio</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                        <Skeleton className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error || !assets) {
    return (
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="text-red-500">Error loading holdings data</div>
      </div>
    );
  }

  // Even with no error, make sure we have data to display
  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow mb-6 p-6 text-center">
        <p className="text-gray-500 mb-4">You don't have any holdings yet.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setLocation('/add-transaction')}>Add Transaction</Button>
          <Button variant="outline" onClick={() => setLocation('/add-manual-asset')}>Add Manual Asset</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="assetFilter" className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <Select
              value={assetFilter}
              onValueChange={setAssetFilter}
            >
              <SelectTrigger id="assetFilter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Assets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="equity">Equities</SelectItem>
                <SelectItem value="bonds">Bonds</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="alternatives">Alternatives</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger id="sortBy" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Value (High to Low)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value (High to Low)</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search holdings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Shares/Units</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">% of Portfolio</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample data for visualization purposes until we properly fetch and calculate values */}
              {assets.map((asset) => (
                <TableRow 
                  key={asset.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleView(asset.id)}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                        {asset.isManual ? (
                          <DollarSign className="h-5 w-5 text-blue-500" />
                        ) : (
                          <span className="text-sm font-medium text-gray-800">{asset.ticker}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">
                          {asset.sector || asset.assetClass}
                          {asset.isManual && <span className="text-xs italic ml-1">(Manual)</span>}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-500">
                    {asset.isManual ? "-" : "150"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-500">
                    {asset.isManual ? "-" : "$142.05"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-500">
                    {asset.isManual ? "-" : "$162.33"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-900">
                    {asset.isManual ? "$12,500.00" : "$24,350.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.isManual ? (
                      <span className="text-gray-500 text-sm">+$0.00 (0.0%)</span>
                    ) : (
                      <span className="text-success text-sm">+$3,245.50 (+15.4%)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-900">
                    {asset.isManual ? "10.0%" : "19.6%"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700 h-8 w-8 p-0 mr-1" onClick={(e) => { e.stopPropagation(); /* handle edit */ }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger hover:text-red-700 h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); /* handle delete */ }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default HoldingsTable;
