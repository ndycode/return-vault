/**
 * Database Connection
 * Singleton database instance with initialization
 */

import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'warranty-locker.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Initialize and return the database instance
 * Runs migrations on first call
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) {
        return dbInstance;
    }

    // Prevent multiple simultaneous initializations
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        console.log('[DB] Opening database...');
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        console.log('[DB] Running migrations...');
        await runMigrations(db);

        dbInstance = db;
        console.log('[DB] Database ready');
        return db;
    })();

    return initPromise;
}

/**
 * Close database connection
 * Primarily for testing
 */
export async function closeDatabase(): Promise<void> {
    if (dbInstance) {
        await dbInstance.closeAsync();
        dbInstance = null;
        initPromise = null;
        console.log('[DB] Database closed');
    }
}
