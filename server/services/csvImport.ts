import { parse } from 'csv-parse/sync';
import { Transaction, InsertTransaction } from '../../shared/schema';
import { storage } from '../storage';

interface CSVTransaction {
  'Trade Date': string;
  Symbol: string;
  Quantity: string;
  Price: string;
  'Transaction Fee': string;
}

interface ImportResult {
  success: number;
  errors: number;
  totalRows: number;
  errorMessages: string[];
}

export class CSVImportService {
  /**
   * Process a CSV file containing transaction data
   * 
   * @param fileContent The content of the CSV file as a string
   * @returns Result of the import process
   */
  async processTransactionsCSV(fileContent: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      errors: 0,
      totalRows: 0,
      errorMessages: []
    };

    try {
      // Parse CSV content
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }) as CSVTransaction[];

      result.totalRows = records.length;

      // Process each record
      for (const record of records) {
        try {
          await this.processTransaction(record);
          result.success++;
        } catch (error) {
          result.errors++;
          result.errorMessages.push(
            error instanceof Error 
              ? `Row with Symbol ${record.Symbol || 'unknown'}: ${error.message}`
              : `Failed to process row with Symbol ${record.Symbol || 'unknown'}`
          );
        }
      }
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? `Failed to parse CSV: ${error.message}`
          : 'Failed to parse CSV file'
      );
    }

    return result;
  }

  /**
   * Process a single transaction from CSV
   * 
   * @param record CSV record for a transaction
   */
  private async processTransaction(record: CSVTransaction): Promise<void> {
    // Validate required fields
    if (!record['Trade Date']) throw new Error('Trade Date is required');
    if (!record.Symbol) throw new Error('Symbol is required');
    if (!record.Quantity) throw new Error('Quantity is required');
    if (!record.Price) throw new Error('Price is required');

    // Parse date
    const tradeDate = this.parseDate(record['Trade Date']);
    
    // Parse numbers
    const quantity = parseFloat(record.Quantity);
    const price = parseFloat(record.Price);
    const fee = record['Transaction Fee'] ? parseFloat(record['Transaction Fee']) : 0;

    // Validate parsed values
    if (isNaN(quantity)) throw new Error('Invalid quantity');
    if (isNaN(price)) throw new Error('Invalid price');
    if (isNaN(fee)) throw new Error('Invalid transaction fee');

    // Create or get asset
    let asset = await storage.getAssetByTicker(record.Symbol);
    
    if (!asset) {
      // Create a new asset if it doesn't exist
      asset = await storage.createAsset({
        ticker: record.Symbol,
        name: record.Symbol, // Use ticker as name temporarily
        assetClass: 'Equities',
        currentPrice: price,
        currency: 'USD',
      });
    }

    // Create transaction
    const transaction: InsertTransaction = {
      assetId: asset.id,
      date: tradeDate,
      type: quantity > 0 ? 'buy' : 'sell',
      quantity: Math.abs(quantity),
      price,
      fee,
      notes: `Imported from CSV on ${new Date().toISOString().split('T')[0]}`,
    };

    await storage.createTransaction(transaction);
  }

  /**
   * Parse a date string in common formats
   * 
   * @param dateStr Date string from CSV
   * @returns JavaScript Date object
   */
  private parseDate(dateStr: string): Date {
    // Try different date formats
    const formats = [
      // MM/DD/YYYY
      (str: string) => {
        const [month, day, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
      },
      // DD/MM/YYYY
      (str: string) => {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
      },
      // YYYY-MM-DD
      (str: string) => {
        const [year, month, day] = str.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
    ];

    // Try each format until we get a valid date
    for (const formatFn of formats) {
      try {
        const date = formatFn(dateStr);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        // Try next format
      }
    }

    // If all formats fail, throw an error
    throw new Error(`Invalid date format: ${dateStr}`);
  }
}

export const csvImportService = new CSVImportService();