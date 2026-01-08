/**
 * Diagnostics Service
 * Provides system information for dev builds
 * Hidden in production builds
 */

import { getDatabase } from '../db/database';
import { getLatestVersion } from '../db/migrations';
import { getPurchaseCounts } from '../db/repositories/purchaseRepository';
import { isDebugActive, getDebugSettings } from '../utils/debug';

export interface DiagnosticsData {
    app: {
        version: string;
        buildNumber: string;
        isDevBuild: boolean;
    };
    database: {
        schemaVersion: number;
        expectedVersion: number;
        isUpToDate: boolean;
    };
    purchases: {
        total: number;
        active: number;
        archived: number;
    };
    notifications: {
        permissionStatus: 'granted' | 'denied' | 'undetermined' | 'unknown';
    };
    backup: {
        lastBackupDate: string | null;
    };
    debug: {
        enabled: boolean;
        categories: Record<string, boolean>;
    };
}

/**
 * Get current database schema version
 */
async function getDatabaseSchemaVersion(): Promise<number> {
    try {
        const db = await getDatabase();
        const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
        return result?.user_version ?? 0;
    } catch {
        return -1;
    }
}

/**
 * Collect all diagnostics data
 * Only available in DEV builds
 */
export async function collectDiagnostics(): Promise<DiagnosticsData | null> {
    // Return null in production builds
    if (!__DEV__) {
        return null;
    }

    try {
        // Database info
        const schemaVersion = await getDatabaseSchemaVersion();
        const expectedVersion = getLatestVersion();

        // Purchase counts
        const purchaseCounts = await getPurchaseCounts();

        // Debug settings
        const debugSettings = getDebugSettings();

        // Notification permission - simplified for now
        // Will need expo-notifications to get actual status
        const notificationPermission = 'unknown' as const;

        // Last backup - would need to be stored in AsyncStorage
        const lastBackupDate = null;

        return {
            app: {
                version: '1.0.0', // From app.json
                buildNumber: '1',
                isDevBuild: __DEV__,
            },
            database: {
                schemaVersion,
                expectedVersion,
                isUpToDate: schemaVersion === expectedVersion,
            },
            purchases: purchaseCounts,
            notifications: {
                permissionStatus: notificationPermission,
            },
            backup: {
                lastBackupDate,
            },
            debug: {
                enabled: debugSettings.enabled,
                categories: debugSettings.categories,
            },
        };
    } catch (error) {
        console.error('[Diagnostics] Failed to collect diagnostics:', error);
        return null;
    }
}

/**
 * Check if diagnostics should be visible
 */
export function shouldShowDiagnostics(): boolean {
    return __DEV__ === true;
}
