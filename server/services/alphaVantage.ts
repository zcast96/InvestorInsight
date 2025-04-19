// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

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

class AlphaVantageService {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
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
      
      return Object.entries(timeSeriesData).map(([date, values]) => ({
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
}

export const alphaVantageService = new AlphaVantageService();
