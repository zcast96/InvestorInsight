// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Asset, Transaction, StockQuote, ManualAssetValue } from './types';

/**
 * Calculate the total value of a portfolio
 */
export function calculatePortfolioValue(
  assets: Asset[],
  transactions: Transaction[],
  quotes: Record<string, StockQuote>,
  manualValues: ManualAssetValue[]
): number {
  let totalValue = 0;

  // Process each asset
  for (const asset of assets) {
    if (asset.isManual) {
      // For manual assets, use the most recent manual value entry
      const assetValues = manualValues.filter(v => v.assetId === asset.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (assetValues.length > 0) {
        totalValue += assetValues[0].value;
      }
    } else if (asset.ticker && quotes[asset.ticker]) {
      // For equity assets with a quote, calculate based on shares and current price
      const assetTransactions = transactions.filter(t => t.assetId === asset.id);
      const shares = calculateShares(assetTransactions);
      totalValue += shares * quotes[asset.ticker].price;
    }
  }

  return totalValue;
}

/**
 * Calculate the number of shares owned for an asset based on its transactions
 */
export function calculateShares(transactions: Transaction[]): number {
  let shares = 0;
  
  for (const transaction of transactions) {
    if (transaction.type === 'buy') {
      shares += Number(transaction.shares);
    } else if (transaction.type === 'sell') {
      shares -= Number(transaction.shares);
    }
  }
  
  return shares;
}

/**
 * Calculate the average purchase price for an asset
 */
export function calculateAveragePurchasePrice(transactions: Transaction[]): number {
  let totalCost = 0;
  let totalShares = 0;
  
  // Only consider buy transactions
  const buyTransactions = transactions.filter(t => t.type === 'buy');
  
  for (const transaction of buyTransactions) {
    const shares = Number(transaction.shares);
    const price = Number(transaction.price);
    const commission = Number(transaction.commission || 0);
    
    totalCost += (shares * price) + commission;
    totalShares += shares;
  }
  
  return totalShares > 0 ? totalCost / totalShares : 0;
}

/**
 * Calculate gain/loss for an asset
 */
export function calculateGainLoss(
  transactions: Transaction[],
  currentPrice: number
): { value: number; percentage: number } {
  const avgPurchasePrice = calculateAveragePurchasePrice(transactions);
  const shares = calculateShares(transactions);
  
  if (shares <= 0 || avgPurchasePrice <= 0) {
    return { value: 0, percentage: 0 };
  }
  
  const costBasis = avgPurchasePrice * shares;
  const currentValue = currentPrice * shares;
  const gainLossValue = currentValue - costBasis;
  const gainLossPercentage = (gainLossValue / costBasis) * 100;
  
  return {
    value: gainLossValue,
    percentage: gainLossPercentage
  };
}

/**
 * Calculate the Sharpe ratio (simplified)
 * Sharpe ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation
 */
export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number = 0.02, // 2% as a default
  portfolioStandardDeviation: number
): number {
  if (portfolioStandardDeviation === 0) return 0;
  return (portfolioReturn - riskFreeRate) / portfolioStandardDeviation;
}

/**
 * Calculate portfolio volatility (standard deviation of returns)
 */
export function calculateVolatility(returns: number[]): number {
  if (returns.length <= 1) return 0;
  
  // Calculate average return
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Calculate sum of squared differences
  const squaredDifferencesSum = returns.reduce((sum, value) => {
    const difference = value - mean;
    return sum + (difference * difference);
  }, 0);
  
  // Calculate standard deviation
  return Math.sqrt(squaredDifferencesSum / (returns.length - 1));
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
