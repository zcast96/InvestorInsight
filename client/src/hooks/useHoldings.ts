// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Asset, 
  Transaction, 
  ManualAssetValue,
  FundamentalMetrics,
  StockQuote,
  StockOverview,
  TimeSeriesData,
  TransactionFormData, 
  ManualAssetFormData,
  FundamentalMetricsFormData 
} from '@/lib/types';

// === Asset Queries ===

// Get all assets
export function useAssets() {
  return useQuery<Asset[]>({
    queryKey: ['/api/assets'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get asset by ID
export function useAsset(id: number | null) {
  return useQuery<Asset>({
    queryKey: [`/api/assets/${id}`],
    enabled: id !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create asset mutation
export function useCreateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiRequest('POST', '/api/assets', asset);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}

// Update asset mutation
export function useUpdateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Asset> }) => {
      const response = await apiRequest('PATCH', `/api/assets/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${variables.id}`] });
    },
  });
}

// Delete asset mutation
export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/assets/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}

// === Transaction Queries ===

// Get transactions by asset ID
export function useTransactionsByAssetId(assetId: number | null) {
  return useQuery<Transaction[]>({
    queryKey: [`/api/assets/${assetId}/transactions`],
    enabled: assetId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create transaction mutation
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: TransactionFormData) => {
      // First get or create the asset
      let assetId: number;
      
      try {
        // Check if asset with ticker exists
        const assetResponse = await fetch(`/api/assets?ticker=${transaction.ticker}`);
        const assets = await assetResponse.json();
        
        if (assets.length > 0) {
          assetId = assets[0].id;
        } else {
          // Create new asset
          const createAssetResponse = await apiRequest('POST', '/api/assets', {
            ticker: transaction.ticker,
            name: transaction.ticker, // Will be updated when quote is fetched
            assetClass: 'equity',
            isManual: false
          });
          const newAsset = await createAssetResponse.json();
          assetId = newAsset.id;
        }
        
        // Create transaction
        const createTransactionResponse = await apiRequest('POST', '/api/transactions', {
          assetId,
          type: transaction.transactionType,
          shares: transaction.shares,
          price: transaction.price,
          date: new Date(transaction.date),
          commission: transaction.includeCommission ? transaction.commission : undefined
        });
        
        return createTransactionResponse.json();
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      // We don't know which asset was affected, so refresh portfolio data
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });
}

// Update transaction mutation
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Transaction> }) => {
      const response = await apiRequest('PATCH', `/api/transactions/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      // No easy way to know which asset this transaction belongs to
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });
}

// Delete transaction mutation
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/transactions/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });
}

// === Manual Asset Values Queries ===

// Get manual asset values by asset ID
export function useManualAssetValuesByAssetId(assetId: number | null) {
  return useQuery<ManualAssetValue[]>({
    queryKey: [`/api/assets/${assetId}/values`],
    enabled: assetId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create manual asset value mutation (for manual assets)
export function useCreateManualAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ManualAssetFormData) => {
      try {
        // Create asset
        const createAssetResponse = await apiRequest('POST', '/api/assets', {
          name: data.assetName,
          assetClass: data.assetClass,
          isManual: true
        });
        const newAsset = await createAssetResponse.json();
        
        // Create manual value
        const createValueResponse = await apiRequest('POST', '/api/manual-values', {
          assetId: newAsset.id,
          value: data.currentValue,
          date: new Date()
        });
        
        return {
          asset: newAsset,
          value: await createValueResponse.json()
        };
      } catch (error) {
        console.error('Error creating manual asset:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });
}

// Update manual asset value mutation
export function useUpdateManualAssetValue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assetId, value }: { assetId: number; value: number }) => {
      const response = await apiRequest('POST', '/api/manual-values', {
        assetId,
        value,
        date: new Date()
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${variables.assetId}/values`] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });
}

// === Fundamental Metrics Queries ===

// Get fundamental metrics by asset ID
export function useFundamentalMetricsByAssetId(assetId: number | null) {
  return useQuery<FundamentalMetrics>({
    queryKey: [`/api/assets/${assetId}/metrics`],
    enabled: assetId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update fundamental metrics mutation
export function useUpdateFundamentalMetrics() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assetId, data }: { assetId: number; data: FundamentalMetricsFormData }) => {
      const response = await apiRequest('POST', '/api/metrics', {
        assetId,
        ...data,
        lastUpdated: new Date()
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${variables.assetId}/metrics`] });
    },
  });
}

// === Market Data Queries ===

// Get stock quote
export function useStockQuote(symbol: string | null) {
  return useQuery<StockQuote>({
    queryKey: [`/api/market/quote/${symbol}`],
    enabled: symbol !== null && symbol !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get stock overview (fundamentals)
export function useStockOverview(symbol: string | null) {
  return useQuery<StockOverview>({
    queryKey: [`/api/market/overview/${symbol}`],
    enabled: symbol !== null && symbol !== '',
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Get stock price history
export function useStockHistory(symbol: string | null, full: boolean = false) {
  return useQuery<TimeSeriesData[]>({
    queryKey: [`/api/market/history/${symbol}?full=${full}`],
    enabled: symbol !== null && symbol !== '',
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Get benchmark performance
export function useBenchmarkPerformance(symbol: string | null) {
  return useQuery<TimeSeriesData[]>({
    queryKey: [`/api/market/benchmark/${symbol}`],
    enabled: symbol !== null && symbol !== '',
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
