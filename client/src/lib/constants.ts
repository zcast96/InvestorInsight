// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

export const ASSET_CLASSES = [
  { value: 'equity', label: 'Equity' },
  { value: 'cash', label: 'Cash' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'alternatives', label: 'Alternatives' },
  { value: 'other', label: 'Other' },
];

export const PERFORMANCE_PERIODS = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: '5Y', label: '5Y' },
  { value: 'All', label: 'All' },
];

export const BENCHMARK_OPTIONS = [
  { value: 'SPY', label: 'S&P 500 (SPY)' },
  { value: 'QQQ', label: 'NASDAQ 100 (QQQ)' },
  { value: 'DIA', label: 'Dow Jones (DIA)' },
  { value: 'IWM', label: 'Russell 2000 (IWM)' },
  { value: 'VTI', label: 'Total Market (VTI)' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (C$)' },
];

export const SECTORS = [
  'Technology',
  'Financial',
  'Healthcare',
  'Consumer Cyclical',
  'Consumer Defensive',
  'Industrials',
  'Basic Materials',
  'Energy',
  'Utilities',
  'Real Estate',
  'Communication Services',
  'Other',
];

// Chart colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  blue: '#60A5FA',
  green: '#4ADE80',
  yellow: '#FBBF24',
  red: '#F87171',
  purple: '#A855F7',
  indigo: '#818CF8',
  gray: '#9CA3AF',
};

// Default display data (will be replaced with API data)
export const DEFAULT_USER_ID = 1;
