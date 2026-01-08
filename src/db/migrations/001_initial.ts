/**
 * Initial Database Migration
 * Creates purchases and attachments tables
 */

import { SQLiteDatabase } from 'expo-sqlite';

export const MIGRATION_VERSION = 1;

export async function migrate001Initial(db: SQLiteDatabase): Promise<void> {
    // Create purchases table
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      store TEXT,
      price REAL,
      currency TEXT DEFAULT 'USD',
      purchaseDate TEXT NOT NULL,
      returnWindowDays INTEGER,
      returnDeadline TEXT,
      warrantyMonths INTEGER,
      warrantyExpiry TEXT,
      serialNumber TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
      notificationIds TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

    // Create indexes for purchases
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_purchases_returnDeadline ON purchases(returnDeadline);
  `);
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_purchases_warrantyExpiry ON purchases(warrantyExpiry);
  `);
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
  `);
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_purchases_store ON purchases(store);
  `);
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_purchases_purchaseDate ON purchases(purchaseDate);
  `);

    // Create attachments table
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY NOT NULL,
      purchaseId TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('receipt', 'serial', 'warranty', 'other')),
      uri TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE
    );
  `);

    // Create index for attachments
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_attachments_purchaseId ON attachments(purchaseId);
  `);
}
