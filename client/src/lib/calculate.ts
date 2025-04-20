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
  


/**
 * Calculate Time-Weighted Return (TWR)
 * TWR eliminates the impact of cash flows on returns
 */
export function calculateTWR(
  periodReturns: number[],
  timestamps: Date[]
): number {
  if (periodReturns.length === 0) return 0;
  
  // Calculate compound return
  const twr = periodReturns.reduce((acc, return_) => (1 + acc) * (1 + return_) - 1, 0);
  return twr;
}

/**
 * Calculate Money-Weighted Return (Internal Rate of Return)
 */
export function calculateMWR(
  cashFlows: number[],
  dates: Date[],
  finalValue: number
): number {
  if (cashFlows.length === 0) return 0;
  
  // Newton-Raphson method to find IRR
  let guess = 0.1; // Initial guess of 10%
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = -finalValue;
    let derivative = 0;
    const t0 = dates[0].getTime();
    
    for (let j = 0; j < cashFlows.length; j++) {
      const t = (dates[j].getTime() - t0) / (365 * 24 * 60 * 60 * 1000);
      npv += cashFlows[j] * Math.pow(1 + guess, t);
      derivative += t * cashFlows[j] * Math.pow(1 + guess, t - 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    guess = guess - npv / derivative;
  }
  
  return guess;
}

/**
 * Calculate Value at Risk (VaR)
 * Using historical simulation method
 */
export function calculateVaR(
  returns: number[],
  confidence: number = 0.95
): number {
  if (returns.length === 0) return 0;
  
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * returns.length);
  return -sortedReturns[index];
}

/**
 * Calculate Maximum Drawdown
 */
export function calculateMaxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;
  
  let maxDrawdown = 0;
  let peak = values[0];
  
  for (const value of values) {
    if (value > peak) {
      peak = value;
    } else {
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
}

/**
 * Calculate Attribution Analysis
 */
export function calculateAttribution(
  portfolioReturns: number[],
  benchmarkReturns: number[],
  weights: number[]
): { allocation: number; selection: number; interaction: number } {
  if (portfolioReturns.length === 0 || portfolioReturns.length !== benchmarkReturns.length) {
    return { allocation: 0, selection: 0, interaction: 0 };
  }
  
  const allocation = weights.reduce((sum, weight, i) => 
    sum + weight * (benchmarkReturns[i] - benchmarkReturns[i]), 0);
    
  const selection = weights.reduce((sum, weight, i) => 
    sum + weight * (portfolioReturns[i] - benchmarkReturns[i]), 0);
    
  const interaction = weights.reduce((sum, weight, i) => 
    sum + weight * (portfolioReturns[i] - benchmarkReturns[i]) * 
    (benchmarkReturns[i] - benchmarkReturns[i]), 0);
    
  return { allocation, selection, interaction };
}

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
