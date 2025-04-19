// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { alphaVantageService } from "./services/alphaVantage";
import { insertAssetSchema, insertTransactionSchema, insertManualAssetValueSchema, insertFundamentalMetricsSchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // === Assets API ===
  
  // Get all assets
  app.get("/api/assets", async (req: Request, res: Response) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve assets" });
    }
  });

  // Get single asset by ID
  app.get("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getAsset(id);
      
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve asset" });
    }
  });

  // Create new asset
  app.post("/api/assets", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertAssetSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error });
      }
      
      const asset = await storage.createAsset(parsedBody.data);
      res.status(201).json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  // Update asset
  app.patch("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedAsset = await storage.updateAsset(id, updateData);
      
      if (!updatedAsset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      res.json(updatedAsset);
    } catch (error) {
      res.status(500).json({ error: "Failed to update asset" });
    }
  });

  // Delete asset
  app.delete("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAsset(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  // === Transactions API ===
  
  // Get all transactions
  app.get("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve transactions" });
    }
  });

  // Get transactions by asset ID
  app.get("/api/assets/:assetId/transactions", async (req: Request, res: Response) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const transactions = await storage.getTransactionsByAssetId(assetId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve transactions" });
    }
  });

  // Create new transaction
  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertTransactionSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error });
      }
      
      const transaction = await storage.createTransaction(parsedBody.data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Update transaction
  app.patch("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedTransaction = await storage.updateTransaction(id, updateData);
      
      if (!updatedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  // Delete transaction
  app.delete("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTransaction(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // === Manual Asset Values API ===
  
  // Get manual asset values by asset ID
  app.get("/api/assets/:assetId/values", async (req: Request, res: Response) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const values = await storage.getManualAssetValuesByAssetId(assetId);
      res.json(values);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve manual asset values" });
    }
  });

  // Create manual asset value
  app.post("/api/manual-values", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertManualAssetValueSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error });
      }
      
      const value = await storage.createManualAssetValue(parsedBody.data);
      res.status(201).json(value);
    } catch (error) {
      res.status(500).json({ error: "Failed to create manual asset value" });
    }
  });

  // Update manual asset value
  app.patch("/api/manual-values/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedValue = await storage.updateManualAssetValue(id, updateData);
      
      if (!updatedValue) {
        return res.status(404).json({ error: "Manual asset value not found" });
      }
      
      res.json(updatedValue);
    } catch (error) {
      res.status(500).json({ error: "Failed to update manual asset value" });
    }
  });

  // === Fundamental Metrics API ===
  
  // Get fundamental metrics by asset ID
  app.get("/api/assets/:assetId/metrics", async (req: Request, res: Response) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const metrics = await storage.getFundamentalMetricsByAssetId(assetId);
      
      if (!metrics) {
        return res.status(404).json({ error: "Fundamental metrics not found" });
      }
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve fundamental metrics" });
    }
  });

  // Create or update fundamental metrics
  app.post("/api/metrics", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertFundamentalMetricsSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error });
      }
      
      // Check if metrics exist for this asset
      const existingMetrics = await storage.getFundamentalMetricsByAssetId(parsedBody.data.assetId);
      
      if (existingMetrics) {
        // Update existing
        const updated = await storage.updateFundamentalMetrics(existingMetrics.id, {
          ...parsedBody.data,
          lastUpdated: new Date()
        });
        return res.json(updated);
      } else {
        // Create new
        const metrics = await storage.createFundamentalMetrics({
          ...parsedBody.data,
          lastUpdated: new Date()
        });
        return res.status(201).json(metrics);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to save fundamental metrics" });
    }
  });

  // === Settings API ===
  
  // Get user settings
  app.get("/api/settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getSettings(userId);
      
      if (!settings) {
        // Create default settings if not found
        const defaultSettings = await storage.createSettings({
          userId,
          primaryBenchmark: 'SPY',
          secondaryBenchmark: 'QQQ',
          currencyDisplay: 'USD',
          autoRefresh: false,
          darkMode: false
        });
        return res.json(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve settings" });
    }
  });

  // Update settings
  app.patch("/api/settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const updateData = req.body;
      
      let settings = await storage.getSettings(userId);
      
      if (!settings) {
        // Create if not exists
        settings = await storage.createSettings({
          userId,
          ...updateData
        });
      } else {
        // Update existing
        settings = await storage.updateSettings(userId, updateData) || settings;
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // === Market Data API (Alpha Vantage) ===
  
  // Get stock quote
  app.get("/api/market/quote/:symbol", async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const quote = await alphaVantageService.getStockQuote(symbol);
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve stock quote" });
    }
  });

  // Get stock overview (fundamentals)
  app.get("/api/market/overview/:symbol", async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const overview = await alphaVantageService.getStockOverview(symbol);
      res.json(overview);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve stock overview" });
    }
  });

  // Get stock price history
  app.get("/api/market/history/:symbol", async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const outputSize = req.query.full === 'true' ? 'full' : 'compact';
      const history = await alphaVantageService.getTimeSeriesDaily(symbol, outputSize as 'compact' | 'full');
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve stock price history" });
    }
  });

  // Get benchmark performance
  app.get("/api/market/benchmark/:symbol", async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const benchmarkData = await alphaVantageService.getBenchmarkPerformance(symbol);
      res.json(benchmarkData);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve benchmark data" });
    }
  });

  // === Portfolio Analytics API ===
  
  // Get portfolio summary
  app.get("/api/portfolio/summary", async (req: Request, res: Response) => {
    try {
      // Get all assets
      const assets = await storage.getAssets();
      const transactions = await storage.getTransactions();
      
      // Calculate portfolio value, etc.
      // This is a simplified version - real implementation would need to fetch current prices
      const summary = {
        totalValue: 0,
        gainLoss: 0,
        gainLossPercent: 0,
        sharpeRatio: 1.67, // Placeholder
        volatility: 14.2, // Placeholder
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate portfolio summary" });
    }
  });

  // Get asset allocation
  app.get("/api/portfolio/allocation", async (req: Request, res: Response) => {
    try {
      const assets = await storage.getAssets();
      const transactions = await storage.getTransactions();
      
      // Group by asset class and calculate percentage
      const allocation = [
        { class: 'Equities', percentage: 65 },
        { class: 'Bonds', percentage: 15 },
        { class: 'Cash', percentage: 10 },
        { class: 'Real Estate', percentage: 5 },
        { class: 'Commodities', percentage: 5 }
      ];
      
      res.json(allocation);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate asset allocation" });
    }
  });

  // Get sector diversification
  app.get("/api/portfolio/diversification", async (req: Request, res: Response) => {
    try {
      const assets = await storage.getAssets();
      const transactions = await storage.getTransactions();
      
      // Group by sector and calculate percentage
      const diversification = [
        { sector: 'Technology', percentage: 28 },
        { sector: 'Financial', percentage: 18 },
        { sector: 'Healthcare', percentage: 15 },
        { sector: 'Consumer Cyclical', percentage: 12 },
        { sector: 'Industrial', percentage: 10 },
        { sector: 'Other', percentage: 17 }
      ];
      
      res.json(diversification);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate sector diversification" });
    }
  });

  // Get portfolio performance
  app.get("/api/portfolio/performance", async (req: Request, res: Response) => {
    try {
      const periods = ['1M', '3M', 'YTD', '1Y', '3Y', '5Y', 'All'];
      const period = req.query.period as string || '1Y';
      
      if (!periods.includes(period)) {
        return res.status(400).json({ error: "Invalid period" });
      }
      
      // Sample data structure for portfolio performance
      const performance = {
        period,
        portfolioData: [
          { date: '2022-01', value: 100000, percentage: 0 },
          { date: '2022-02', value: 102300, percentage: 2.3 },
          { date: '2022-03', value: 103100, percentage: 3.1 },
          { date: '2022-04', value: 105600, percentage: 5.6 },
          { date: '2022-05', value: 108900, percentage: 8.9 },
          { date: '2022-06', value: 110200, percentage: 10.2 },
          { date: '2022-07', value: 109800, percentage: 9.8 },
          { date: '2022-08', value: 112500, percentage: 12.5 },
          { date: '2022-09', value: 113800, percentage: 13.8 },
          { date: '2022-10', value: 114200, percentage: 14.2 },
          { date: '2022-11', value: 114800, percentage: 14.8 },
          { date: '2022-12', value: 115300, percentage: 15.3 }
        ],
        benchmarkData: {
          'SPY': [
            { date: '2022-01', percentage: 0 },
            { date: '2022-02', percentage: 1.8 },
            { date: '2022-03', percentage: 2.5 },
            { date: '2022-04', percentage: 3.2 },
            { date: '2022-05', percentage: 4.1 },
            { date: '2022-06', percentage: 5.0 },
            { date: '2022-07', percentage: 5.7 },
            { date: '2022-08', percentage: 6.3 },
            { date: '2022-09', percentage: 6.9 },
            { date: '2022-10', percentage: 7.5 },
            { date: '2022-11', percentage: 8.2 },
            { date: '2022-12', percentage: 8.7 }
          ],
          'QQQ': [
            { date: '2022-01', percentage: 0 },
            { date: '2022-02', percentage: 2.1 },
            { date: '2022-03', percentage: 3.5 },
            { date: '2022-04', percentage: 4.8 },
            { date: '2022-05', percentage: 6.2 },
            { date: '2022-06', percentage: 7.1 },
            { date: '2022-07', percentage: 8.0 },
            { date: '2022-08', percentage: 8.9 },
            { date: '2022-09', percentage: 9.5 },
            { date: '2022-10', percentage: 10.3 },
            { date: '2022-11', percentage: 11.2 },
            { date: '2022-12', percentage: 12.1 }
          ]
        }
      };
      
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve portfolio performance" });
    }
  });

  // Get top holdings
  app.get("/api/portfolio/top-holdings", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      
      // Get holdings with their current values
      const assets = await storage.getAssets();
      const transactions = await storage.getTransactions();
      
      // Sample top holdings
      const topHoldings = [
        { 
          id: 1, 
          symbol: 'AAPL', 
          name: 'Apple Inc', 
          value: 24350, 
          gainLoss: 3245.50, 
          gainLossPercent: 15.4, 
          percentage: 19.6 
        },
        { 
          id: 2, 
          symbol: 'MSFT', 
          name: 'Microsoft Corp', 
          value: 18720, 
          gainLoss: 2890.30, 
          gainLossPercent: 18.3, 
          percentage: 15.0 
        },
        { 
          id: 3, 
          symbol: 'AMZN', 
          name: 'Amazon.com Inc', 
          value: 12680, 
          gainLoss: -1350.40, 
          gainLossPercent: -9.6, 
          percentage: 10.2 
        },
        { 
          id: 4, 
          symbol: 'GOOGL', 
          name: 'Alphabet Inc', 
          value: 10430, 
          gainLoss: 1120.80, 
          gainLossPercent: 12.0, 
          percentage: 8.4 
        },
        { 
          id: 5, 
          symbol: 'META', 
          name: 'Meta Platforms Inc', 
          value: 9250, 
          gainLoss: 1640.30, 
          gainLossPercent: 21.6, 
          percentage: 7.4 
        }
      ].slice(0, limit);
      
      res.json(topHoldings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve top holdings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
