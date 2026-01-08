/**
 * Debug Utilities
 * Dev-only logging with category toggles
 * All logging is stripped in production builds
 */

/**
 * Debug log categories
 */
export type DebugCategory = 'DB' | 'NOTIF' | 'EXPORT' | 'BACKUP' | 'IAP' | 'NAV' | 'GENERAL';

/**
 * Category enable/disable flags
 * Set to true to enable logging for that category
 */
const CATEGORY_ENABLED: Record<DebugCategory, boolean> = {
    DB: true,
    NOTIF: true,
    EXPORT: true,
    BACKUP: true,
    IAP: true,
    NAV: false,
    GENERAL: true,
};

/**
 * Master toggle for all debug logging
 * Set to false to disable all logging regardless of category settings
 */
const DEBUG_ENABLED = true;

/**
 * Check if we're in development mode
 */
function isDev(): boolean {
    return __DEV__ === true;
}

/**
 * Format log message with category prefix and timestamp
 */
function formatMessage(category: DebugCategory, message: string): string {
    const timestamp = new Date().toISOString().substring(11, 23); // HH:MM:SS.mmm
    return `[${timestamp}] [${category}] ${message}`;
}

/**
 * Log a debug message (dev only)
 * @param category - The log category
 * @param message - The message to log
 * @param data - Optional data to log
 */
export function debugLog(
    category: DebugCategory,
    message: string,
    data?: unknown
): void {
    if (!isDev() || !DEBUG_ENABLED || !CATEGORY_ENABLED[category]) {
        return;
    }

    const formattedMessage = formatMessage(category, message);

    if (data !== undefined) {
        console.log(formattedMessage, data);
    } else {
        console.log(formattedMessage);
    }
}

/**
 * Log a warning message (dev only)
 */
export function debugWarn(
    category: DebugCategory,
    message: string,
    data?: unknown
): void {
    if (!isDev() || !DEBUG_ENABLED || !CATEGORY_ENABLED[category]) {
        return;
    }

    const formattedMessage = formatMessage(category, message);

    if (data !== undefined) {
        console.warn(formattedMessage, data);
    } else {
        console.warn(formattedMessage);
    }
}

/**
 * Log an error message (dev only)
 */
export function debugError(
    category: DebugCategory,
    message: string,
    error?: unknown
): void {
    if (!isDev() || !DEBUG_ENABLED || !CATEGORY_ENABLED[category]) {
        return;
    }

    const formattedMessage = formatMessage(category, message);

    if (error !== undefined) {
        console.error(formattedMessage, error);
    } else {
        console.error(formattedMessage);
    }
}

/**
 * Log timing information (dev only)
 * Returns a function to call when the operation completes
 */
export function debugTiming(
    category: DebugCategory,
    operationName: string
): () => void {
    if (!isDev() || !DEBUG_ENABLED || !CATEGORY_ENABLED[category]) {
        return () => {};
    }

    const startTime = Date.now();
    debugLog(category, `${operationName} started`);

    return () => {
        const duration = Date.now() - startTime;
        debugLog(category, `${operationName} completed in ${duration}ms`);
    };
}

/**
 * Create a category-specific logger
 */
export function createCategoryLogger(category: DebugCategory) {
    return {
        log: (message: string, data?: unknown) => debugLog(category, message, data),
        warn: (message: string, data?: unknown) => debugWarn(category, message, data),
        error: (message: string, error?: unknown) => debugError(category, message, error),
        timing: (operationName: string) => debugTiming(category, operationName),
    };
}

// Pre-built category loggers for convenience
export const dbLog = createCategoryLogger('DB');
export const notifLog = createCategoryLogger('NOTIF');
export const exportLog = createCategoryLogger('EXPORT');
export const backupLog = createCategoryLogger('BACKUP');
export const iapLog = createCategoryLogger('IAP');
export const navLog = createCategoryLogger('NAV');

/**
 * Get current category settings (for diagnostics display)
 */
export function getDebugSettings(): {
    enabled: boolean;
    categories: Record<DebugCategory, boolean>;
} {
    return {
        enabled: DEBUG_ENABLED && isDev(),
        categories: { ...CATEGORY_ENABLED },
    };
}

/**
 * Check if debug logging is currently active
 */
export function isDebugActive(): boolean {
    return isDev() && DEBUG_ENABLED;
}
