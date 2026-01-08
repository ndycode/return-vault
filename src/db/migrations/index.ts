/**
 * Migration Runner
 * Handles schema versioning and migration execution
 */

import { SQLiteDatabase } from 'expo-sqlite';
import { migrate001Initial, MIGRATION_VERSION as V1 } from './001_initial';

interface Migration {
    version: number;
    name: string;
    migrate: (db: SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
    { version: V1, name: '001_initial', migrate: migrate001Initial },
];

/**
 * Get current database version
 */
async function getDatabaseVersion(db: SQLiteDatabase): Promise<number> {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    return result?.user_version ?? 0;
}

/**
 * Set database version
 * Note: PRAGMA doesn't support parameterized queries, so we validate the input
 */
async function setDatabaseVersion(db: SQLiteDatabase, version: number): Promise<void> {
    // Validate version is a safe integer to prevent SQL injection
    if (!Number.isInteger(version) || version < 0 || version > 999999) {
        throw new Error(`Invalid migration version: ${version}`);
    }
    await db.execAsync(`PRAGMA user_version = ${version}`);
}

/**
 * Run all pending migrations
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON');

    const currentVersion = await getDatabaseVersion(db);
    console.log(`[DB] Current version: ${currentVersion}`);

    const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
        console.log('[DB] No migrations to run');
        return;
    }

    console.log(`[DB] Running ${pendingMigrations.length} migration(s)`);

    for (const migration of pendingMigrations) {
        console.log(`[DB] Running migration: ${migration.name}`);
        await migration.migrate(db);
        await setDatabaseVersion(db, migration.version);
        console.log(`[DB] Completed migration: ${migration.name}`);
    }

    console.log('[DB] All migrations complete');
}

/**
 * Get latest migration version
 */
export function getLatestVersion(): number {
    return migrations.length > 0 ? migrations[migrations.length - 1].version : 0;
}
