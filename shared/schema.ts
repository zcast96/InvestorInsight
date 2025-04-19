// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (from template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Asset models
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  ticker: text("ticker"),
  name: text("name").notNull(),
  assetClass: text("asset_class").notNull(), // enum: 'equity', 'cash', 'bonds', 'real_estate', 'commodities', 'alternatives', 'other'
  sector: text("sector"),
  isManual: boolean("is_manual").notNull().default(false),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Transaction models
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  type: text("type").notNull(), // 'buy' or 'sell'
  shares: decimal("shares").notNull(),
  price: decimal("price").notNull(),
  date: timestamp("date").notNull(),
  commission: decimal("commission"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Manual asset value (for non-equity assets that don't have market prices)
export const manualAssetValues = pgTable("manual_asset_values", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  value: decimal("value").notNull(),
  date: timestamp("date").notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertManualAssetValueSchema = createInsertSchema(manualAssetValues).omit({
  id: true,
  createdAt: true
});

export type InsertManualAssetValue = z.infer<typeof insertManualAssetValueSchema>;
export type ManualAssetValue = typeof manualAssetValues.$inferSelect;

// Manual fundamental metrics (for data not available via API)
export const fundamentalMetrics = pgTable("fundamental_metrics", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  revenueGrowth: decimal("revenue_growth"),
  grossMargin: decimal("gross_margin"),
  operatingMargin: decimal("operating_margin"),
  netMargin: decimal("net_margin"),
  debtToEquity: decimal("debt_to_equity"),
  userId: integer("user_id"),
  lastUpdated: timestamp("last_updated").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFundamentalMetricsSchema = createInsertSchema(fundamentalMetrics).omit({
  id: true,
  createdAt: true
});

export type InsertFundamentalMetrics = z.infer<typeof insertFundamentalMetricsSchema>;
export type FundamentalMetrics = typeof fundamentalMetrics.$inferSelect;

// User settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  primaryBenchmark: text("primary_benchmark").notNull().default('SPY'),
  secondaryBenchmark: text("secondary_benchmark"),
  currencyDisplay: text("currency_display").notNull().default('USD'),
  autoRefresh: boolean("auto_refresh").notNull().default(false),
  darkMode: boolean("dark_mode").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
