// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Add a delay between API calls to avoid rate limiting issues
const DELAY_BETWEEN_CALLS_MS = 1000; // 1 second delay
let lastCallTime = 0;

async function delayIfNeeded() {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < DELAY_BETWEEN_CALLS_MS && lastCallTime !== 0) {
    const delayTime = DELAY_BETWEEN_CALLS_MS - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, delayTime));
  }
  
  lastCallTime = Date.now();
}

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

export interface CompanyEarnings {
  fiscalDateEnding: string;
  reportedEPS: number;
  estimatedEPS: number | null;
  surprise: number | null;
  surprisePercentage: number | null;
}

export interface IncomeStatementItem {
  fiscalDateEnding: string;
  reportedCurrency: string;
  totalRevenue: number;
  netIncome: number;
  grossProfit: number;
  operatingIncome: number;
  ebitda: number;
}

export interface BalanceSheetItem {
  fiscalDateEnding: string;
  reportedCurrency: string;
  totalAssets: number;
  totalLiabilities: number;
  totalShareholderEquity: number;
  cashAndCashEquivalents: number;
  shortTermDebt: number;
  longTermDebt: number;
}

export interface CashFlowItem {
  fiscalDateEnding: string;
  reportedCurrency: string;
  operatingCashflow: number;
  capitalExpenditures: number;
  dividendPayout: number | null;
  freeCashflow: number | null;
}

export interface SectorPerformance {
  sector: string;
  performance: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonth: number;
    yearToDate: number;
    oneYear: number;
    threeYear: number;
    fiveYear: number;
    tenYear: number;
  };
}

class AlphaVantageService {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data['Global Quote']) {
        throw new Error('Invalid API response format');
      }
      
      const quote = data['Global Quote'];
      
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw error;
    }
  }

  async getStockOverview(symbol: string): Promise<StockOverview> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.Symbol) {
        throw new Error('Invalid API response format');
      }
      
      return {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description,
        exchange: data.Exchange,
        sector: data.Sector,
        industry: data.Industry,
        peRatio: data.PERatio ? parseFloat(data.PERatio) : null,
        pegRatio: data.PEGRatio ? parseFloat(data.PEGRatio) : null,
        dividendYield: data.DividendYield ? parseFloat(data.DividendYield) : null,
        eps: data.EPS ? parseFloat(data.EPS) : null,
        roe: data.ReturnOnEquityTTM ? parseFloat(data.ReturnOnEquityTTM) : null,
        marketCap: data.MarketCapitalization ? parseFloat(data.MarketCapitalization) : null,
        fiftyTwoWeekHigh: data['52WeekHigh'] ? parseFloat(data['52WeekHigh']) : null,
        fiftyTwoWeekLow: data['52WeekLow'] ? parseFloat(data['52WeekLow']) : null
      };
    } catch (error) {
      console.error('Error fetching stock overview:', error);
      throw error;
    }
  }

  async getTimeSeriesDaily(symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<TimeSeriesData[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data['Time Series (Daily)']) {
        throw new Error('Invalid API response format');
      }
      
      const timeSeriesData = data['Time Series (Daily)'];
      
      return Object.entries(timeSeriesData).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error fetching time series data:', error);
      throw error;
    }
  }

  async getBenchmarkPerformance(symbol: string): Promise<TimeSeriesData[]> {
    return this.getTimeSeriesDaily(symbol);
  }
  
  async getCompanyEarnings(symbol: string): Promise<CompanyEarnings[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.quarterlyEarnings) {
        throw new Error('Invalid API response format');
      }
      
      return data.quarterlyEarnings.map((item: any) => ({
        fiscalDateEnding: item.fiscalDateEnding,
        reportedEPS: parseFloat(item.reportedEPS),
        estimatedEPS: item.estimatedEPS ? parseFloat(item.estimatedEPS) : null,
        surprise: item.surprise ? parseFloat(item.surprise) : null,
        surprisePercentage: item.surprisePercentage ? parseFloat(item.surprisePercentage) : null,
      }));
    } catch (error) {
      console.error('Error fetching company earnings:', error);
      throw error;
    }
  }
  
  async getIncomeStatement(symbol: string): Promise<IncomeStatementItem[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.quarterlyReports) {
        throw new Error('Invalid API response format');
      }
      
      return data.quarterlyReports.map((item: any) => ({
        fiscalDateEnding: item.fiscalDateEnding,
        reportedCurrency: item.reportedCurrency,
        totalRevenue: parseFloat(item.totalRevenue),
        netIncome: parseFloat(item.netIncome),
        grossProfit: parseFloat(item.grossProfit),
        operatingIncome: parseFloat(item.operatingIncome),
        ebitda: parseFloat(item.ebitda),
      }));
    } catch (error) {
      console.error('Error fetching income statement:', error);
      throw error;
    }
  }
  
  async getBalanceSheet(symbol: string): Promise<BalanceSheetItem[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.quarterlyReports) {
        throw new Error('Invalid API response format');
      }
      
      return data.quarterlyReports.map((item: any) => ({
        fiscalDateEnding: item.fiscalDateEnding,
        reportedCurrency: item.reportedCurrency,
        totalAssets: parseFloat(item.totalAssets),
        totalLiabilities: parseFloat(item.totalLiabilities),
        totalShareholderEquity: parseFloat(item.totalShareholderEquity),
        cashAndCashEquivalents: parseFloat(item.cashAndCashEquivalents || '0'),
        shortTermDebt: parseFloat(item.shortTermDebt || '0'),
        longTermDebt: parseFloat(item.longTermDebt || '0'),
      }));
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  }
  
  async getCashFlow(symbol: string): Promise<CashFlowItem[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.quarterlyReports) {
        throw new Error('Invalid API response format');
      }
      
      return data.quarterlyReports.map((item: any) => {
        // Calculate free cash flow (not directly provided by Alpha Vantage)
        const operatingCashflow = parseFloat(item.operatingCashflow);
        const capex = parseFloat(item.capitalExpenditures);
        const freeCashflow = operatingCashflow - Math.abs(capex);
        
        return {
          fiscalDateEnding: item.fiscalDateEnding,
          reportedCurrency: item.reportedCurrency,
          operatingCashflow: operatingCashflow,
          capitalExpenditures: capex,
          dividendPayout: item.dividendPayout ? parseFloat(item.dividendPayout) : null,
          freeCashflow: !isNaN(freeCashflow) ? freeCashflow : null,
        };
      });
    } catch (error) {
      console.error('Error fetching cash flow data:', error);
      throw error;
    }
  }
  
  async getSectorPerformance(): Promise<SectorPerformance[]> {
    try {
      await delayIfNeeded();
      
      const response = await fetch(
        `${BASE_URL}?function=SECTOR&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract sector performances
      const rankedPerformances: SectorPerformance[] = [];
      const sectorRankData = data['Rank A: Real-Time Performance'];
      
      for (const sector in sectorRankData) {
        if (sector !== 'Information Technology') { // Skip metadata
          const performance = {
            sector,
            performance: {
              oneDay: parseFloat(sectorRankData[sector].replace('%', '')),
              oneWeek: parseFloat(data['Rank B: 1 Day Performance'][sector].replace('%', '')),
              oneMonth: parseFloat(data['Rank C: 5 Day Performance'][sector].replace('%', '')),
              threeMonth: parseFloat(data['Rank D: 1 Month Performance'][sector].replace('%', '')),
              yearToDate: parseFloat(data['Rank E: 3 Month Performance'][sector].replace('%', '')),
              oneYear: parseFloat(data['Rank F: Year-to-Date (YTD) Performance'][sector].replace('%', '')),
              threeYear: parseFloat(data['Rank G: 1 Year Performance'][sector].replace('%', '')),
              fiveYear: parseFloat(data['Rank H: 3 Year Performance'][sector].replace('%', '')),
              tenYear: parseFloat(data['Rank I: 5 Year Performance'][sector].replace('%', '')),
            }
          };
          
          rankedPerformances.push(performance);
        }
      }
      
      return rankedPerformances;
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      throw error;
    }
  }
}

export const alphaVantageService = new AlphaVantageService();
