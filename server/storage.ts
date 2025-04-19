// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { 
  User, InsertUser,
  Asset, InsertAsset,
  Transaction, InsertTransaction,
  ManualAssetValue, InsertManualAssetValue,
  FundamentalMetrics, InsertFundamentalMetrics,
  Settings, InsertSettings
} from "@shared/schema";

export interface IStorage {
  // User methods (from template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Asset methods
  getAssets(): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetByTicker(ticker: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;

  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByAssetId(assetId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;

  // Manual asset value methods
  getManualAssetValues(): Promise<ManualAssetValue[]>;
  getManualAssetValuesByAssetId(assetId: number): Promise<ManualAssetValue[]>;
  createManualAssetValue(value: InsertManualAssetValue): Promise<ManualAssetValue>;
  updateManualAssetValue(id: number, value: Partial<ManualAssetValue>): Promise<ManualAssetValue | undefined>;
  deleteManualAssetValue(id: number): Promise<boolean>;

  // Fundamental metrics methods
  getFundamentalMetrics(): Promise<FundamentalMetrics[]>;
  getFundamentalMetricsByAssetId(assetId: number): Promise<FundamentalMetrics | undefined>;
  createFundamentalMetrics(metrics: InsertFundamentalMetrics): Promise<FundamentalMetrics>;
  updateFundamentalMetrics(id: number, metrics: Partial<FundamentalMetrics>): Promise<FundamentalMetrics | undefined>;
  deleteFundamentalMetrics(id: number): Promise<boolean>;

  // Settings methods
  getSettings(userId: number): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(userId: number, settings: Partial<Settings>): Promise<Settings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assets: Map<number, Asset>;
  private transactions: Map<number, Transaction>;
  private manualAssetValues: Map<number, ManualAssetValue>;
  private fundamentalMetrics: Map<number, FundamentalMetrics>;
  private settings: Map<number, Settings>;
  private currentId: {
    users: number;
    assets: number;
    transactions: number;
    manualAssetValues: number;
    fundamentalMetrics: number;
    settings: number;
  };

  constructor() {
    this.users = new Map();
    this.assets = new Map();
    this.transactions = new Map();
    this.manualAssetValues = new Map();
    this.fundamentalMetrics = new Map();
    this.settings = new Map();
    this.currentId = {
      users: 1,
      assets: 1,
      transactions: 1,
      manualAssetValues: 1,
      fundamentalMetrics: 1,
      settings: 1
    };

    // Initialize with some sample portfolio data
    this.initializeData();
  }

  // User methods (from template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Asset methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetByTicker(ticker: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(
      (asset) => asset.ticker === ticker,
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentId.assets++;
    const now = new Date();
    const asset: Asset = { 
      ...insertAsset, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: number, assetUpdate: Partial<Asset>): Promise<Asset | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;

    const updatedAsset = { ...asset, ...assetUpdate, updatedAt: new Date() };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionsByAssetId(assetId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.assetId === assetId,
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId.transactions++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: now 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionUpdate: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Manual asset value methods
  async getManualAssetValues(): Promise<ManualAssetValue[]> {
    return Array.from(this.manualAssetValues.values());
  }

  async getManualAssetValuesByAssetId(assetId: number): Promise<ManualAssetValue[]> {
    return Array.from(this.manualAssetValues.values()).filter(
      (value) => value.assetId === assetId,
    );
  }

  async createManualAssetValue(insertValue: InsertManualAssetValue): Promise<ManualAssetValue> {
    const id = this.currentId.manualAssetValues++;
    const now = new Date();
    const value: ManualAssetValue = { 
      ...insertValue, 
      id, 
      createdAt: now 
    };
    this.manualAssetValues.set(id, value);
    return value;
  }

  async updateManualAssetValue(id: number, valueUpdate: Partial<ManualAssetValue>): Promise<ManualAssetValue | undefined> {
    const value = this.manualAssetValues.get(id);
    if (!value) return undefined;

    const updatedValue = { ...value, ...valueUpdate };
    this.manualAssetValues.set(id, updatedValue);
    return updatedValue;
  }

  async deleteManualAssetValue(id: number): Promise<boolean> {
    return this.manualAssetValues.delete(id);
  }

  // Fundamental metrics methods
  async getFundamentalMetrics(): Promise<FundamentalMetrics[]> {
    return Array.from(this.fundamentalMetrics.values());
  }

  async getFundamentalMetricsByAssetId(assetId: number): Promise<FundamentalMetrics | undefined> {
    return Array.from(this.fundamentalMetrics.values()).find(
      (metrics) => metrics.assetId === assetId,
    );
  }

  async createFundamentalMetrics(insertMetrics: InsertFundamentalMetrics): Promise<FundamentalMetrics> {
    const id = this.currentId.fundamentalMetrics++;
    const now = new Date();
    const metrics: FundamentalMetrics = { 
      ...insertMetrics, 
      id, 
      createdAt: now 
    };
    this.fundamentalMetrics.set(id, metrics);
    return metrics;
  }

  async updateFundamentalMetrics(id: number, metricsUpdate: Partial<FundamentalMetrics>): Promise<FundamentalMetrics | undefined> {
    const metrics = this.fundamentalMetrics.get(id);
    if (!metrics) return undefined;

    const updatedMetrics = { ...metrics, ...metricsUpdate };
    this.fundamentalMetrics.set(id, updatedMetrics);
    return updatedMetrics;
  }

  async deleteFundamentalMetrics(id: number): Promise<boolean> {
    return this.fundamentalMetrics.delete(id);
  }

  // Settings methods
  async getSettings(userId: number): Promise<Settings | undefined> {
    return Array.from(this.settings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.currentId.settings++;
    const now = new Date();
    const settings: Settings = { 
      ...insertSettings, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.settings.set(id, settings);
    return settings;
  }

  async updateSettings(userId: number, settingsUpdate: Partial<Settings>): Promise<Settings | undefined> {
    const settingsEntry = Array.from(this.settings.values()).find(
      (settings) => settings.userId === userId,
    );
    
    if (!settingsEntry) return undefined;

    const updatedSettings = { 
      ...settingsEntry, 
      ...settingsUpdate, 
      updatedAt: new Date() 
    };
    this.settings.set(settingsEntry.id, updatedSettings);
    return updatedSettings;
  }

  // Helper to initialize some basic data
  private initializeData() {
    // Default user
    const user = this.createUser({
      username: 'demo',
      password: 'password'
    });

    // Will populate with proper data in routes.ts implementation
  }
}

export const storage = new MemStorage();
