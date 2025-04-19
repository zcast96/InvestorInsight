// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { DEFAULT_USER_ID } from '@/lib/constants';
import { 
  PortfolioSummary, 
  AssetAllocation, 
  SectorDiversification, 
  PortfolioPerformance,
  TopHolding,
  Settings
} from '@/lib/types';

// Get portfolio summary
export function usePortfolioSummary(filters?: { 
  startDate?: string;
  endDate?: string;
  assetClass?: string;
}) {
  return useQuery<PortfolioSummary>({
    queryKey: ['/api/portfolio/summary', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.assetClass) params.append('assetClass', filters.assetClass);

      const response = await fetch(`/api/portfolio/summary?${params}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio summary');
      return response.json();
    }
  });
}

// Get asset allocation
export function useAssetAllocation() {
  return useQuery<AssetAllocation[]>({
    queryKey: ['/api/portfolio/allocation'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get sector diversification
export function useSectorDiversification() {
  return useQuery<SectorDiversification[]>({
    queryKey: ['/api/portfolio/diversification'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get portfolio performance
export function usePortfolioPerformance(period: string = '1Y') {
  return useQuery<PortfolioPerformance>({
    queryKey: [`/api/portfolio/performance?period=${period}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get top holdings
export function useTopHoldings(limit: number = 5) {
  return useQuery<TopHolding[]>({
    queryKey: [`/api/portfolio/top-holdings?limit=${limit}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get settings
export function useSettings(userId: number = DEFAULT_USER_ID) {
  return useQuery<Settings>({
    queryKey: [`/api/settings/${userId}`],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Update settings
export function useUpdateSettings(userId: number = DEFAULT_USER_ID) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<Settings>) => {
      const response = await apiRequest('PATCH', `/api/settings/${userId}`, settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${userId}`] });
    },
  });
}

// Refresh portfolio data
export function useRefreshPortfolioData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['/api/portfolio/summary'] });
    queryClient.invalidateQueries({ queryKey: ['/api/portfolio/allocation'] });
    queryClient.invalidateQueries({ queryKey: ['/api/portfolio/diversification'] });
    queryClient.invalidateQueries({ queryKey: ['/api/portfolio/performance'] });
    queryClient.invalidateQueries({ queryKey: ['/api/portfolio/top-holdings'] });
  };
}