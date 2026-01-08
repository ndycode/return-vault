/**
 * Database Connection
 * Singleton database instance with initialization
 */

import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';
import { dbLog } from '../utils/debug';

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
        dbLog.log('Opening database...');
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        dbLog.log('Running migrations...');
        await runMigrations(db);

        dbInstance = db;
        dbLog.log('Database ready');
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
        dbLog.log('Database closed');
    }
}

/**
 * Execute operations within a database transaction
 * Automatically commits on success, rolls back on failure
 */
export async function withTransaction<T>(
    fn: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
    const db = await getDatabase();
    try {
        await db.execAsync('BEGIN TRANSACTION');
        const result = await fn(db);
        await db.execAsync('COMMIT');
        return result;
    } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
    }
}
