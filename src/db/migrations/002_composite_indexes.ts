/**
 * Migration 002: Composite Indexes
 * Adds composite indexes for common query patterns
 * 
 * These indexes optimize:
 * 1. Status + returnDeadline: Filtering active items by return deadline
 * 2. Status + warrantyExpiry: Filtering active items by warranty expiry
 * 3. Status + purchaseDate: Sorting active items by purchase date
 * 4. Status + store: Filtering/grouping by store for active items
 */

import { SQLiteDatabase } from 'expo-sqlite';

export const MIGRATION_VERSION = 2;

export async function migrate002CompositeIndexes(db: SQLiteDatabase): Promise<void> {
    // Composite index for active items with return deadline (urgency queries)
    await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_purchases_status_returnDeadline 
        ON purchases(status, returnDeadline);
    `);

    // Composite index for active items with warranty expiry (urgency queries)
    await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_purchases_status_warrantyExpiry 
        ON purchases(status, warrantyExpiry);
    `);

    // Composite index for active items sorted by purchase date (listing queries)
    await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_purchases_status_purchaseDate 
        ON purchases(status, purchaseDate);
    `);

    // Composite index for store filtering with status (grouped views)
    await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_purchases_status_store 
        ON purchases(status, store);
    `);

    // Composite index for name search with status (search queries)
    await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_purchases_status_name 
        ON purchases(status, name);
    `);
}
