// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

// Asset types
export interface Asset {
  id: number;
  ticker?: string;
  name: string;
  assetClass: AssetClass;
  sector?: string;
  isManual: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetClass = 'equity' | 'cash' | 'bonds' | 'real_estate' | 'commodities' | 'alternatives' | 'other';

// Transaction types
export interface Transaction {
  id: number;
  assetId: number;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  date: Date;
  commission?: number;
  userId?: number;
  createdAt: Date;
}

// Manual asset values
export interface ManualAssetValue {
  id: number;
  assetId: number;
  value: number;
  date: Date;
  userId?: number;
  createdAt: Date;
}

// Fundamental metrics
export interface FundamentalMetrics {
  id: number;
  assetId: number;
  revenueGrowth?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  debtToEquity?: number;
  userId?: number;
  lastUpdated: Date;
  createdAt: Date;
}

// Settings
export interface Settings {
  id: number;
  userId: number;
  primaryBenchmark: string;
  secondaryBenchmark?: string;
  currencyDisplay: string;
  autoRefresh: boolean;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Market data types
export interface StockQuote {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: Date;
}

export interface StockOverview {
  symbol: string;
  name: string;
  description: string;
  exchange: string;
  sector: string;
  industry: string;
  peRatio: number | null;
  pegRatio: number | null;
  dividendYield: number | null;
  eps: number | null;
  roe: number | null;
  marketCap: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Portfolio analytics types
export interface PortfolioSummary {
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  sharpeRatio: number;
  volatility: number;
}

export interface AssetAllocation {
  class: string;
  percentage: number;
}

export interface SectorDiversification {
  sector: string;
  percentage: number;
}

export interface PortfolioPerformance {
  period: string;
  portfolioData: {
    date: string;
    value: number;
    percentage: number;
  }[];
  benchmarkData: {
    [key: string]: {
      date: string;
      percentage: number;
    }[];
  };
}

export interface TopHolding {
  id: number;
  symbol: string;
  name: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  percentage: number;
}

// Form types
export interface TransactionFormData {
  ticker: string;
  transactionType: 'buy' | 'sell';
  shares: number;
  price: number;
  date: string;
  includeCommission: boolean;
  commission?: number;
}

export interface ManualAssetFormData {
  assetName: string;
  assetClass: string;
  currentValue: number;
  notes?: string;
}

export interface FundamentalMetricsFormData {
  revenueGrowth?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  debtToEquity?: number;
}

export interface SettingsFormData {
  primaryBenchmark: string;
  secondaryBenchmark?: string;
  currencyDisplay: string;
  autoRefresh: boolean;
  darkMode: boolean;
}
