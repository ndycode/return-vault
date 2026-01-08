/**
 * Default Choices Contract
 * Centralized smart defaults for zero-thinking UX
 * 
 * PRINCIPLE: The user should complete common flows WITHOUT THINKING.
 * If the user pauses to decide, the default is wrong.
 * 
 * v1.06-B: Zero-Thinking Defaults
 */

import { getCurrentDateISO } from './dateUtils';

/**
 * Store-specific default policies
 * Based on common US retailer policies (as of 2024)
 * 
 * RULE: Apply when store name matches (case-insensitive partial match)
 * RULE: User can always override via chip selection
 */
export const STORE_DEFAULTS: Record<string, { returnDays: number; warrantyMonths: number }> = {
    // Extended return policies (90 days)
    'costco': { returnDays: 90, warrantyMonths: 24 },
    'rei': { returnDays: 90, warrantyMonths: 12 },
    'nordstrom': { returnDays: 90, warrantyMonths: 12 },
    'll bean': { returnDays: 90, warrantyMonths: 12 },
    'zappos': { returnDays: 90, warrantyMonths: 12 },
    
    // Standard return policies (30 days)
    'amazon': { returnDays: 30, warrantyMonths: 12 },
    'target': { returnDays: 30, warrantyMonths: 12 },
    'walmart': { returnDays: 30, warrantyMonths: 12 },
    'home depot': { returnDays: 30, warrantyMonths: 12 },
    'lowes': { returnDays: 30, warrantyMonths: 12 },
    'ikea': { returnDays: 30, warrantyMonths: 12 },
    
    // Short return policies (14-15 days)
    'best buy': { returnDays: 15, warrantyMonths: 12 },
    'apple': { returnDays: 14, warrantyMonths: 12 },
    'microcenter': { returnDays: 15, warrantyMonths: 12 },
    
    // Electronics with extended warranties
    'b&h': { returnDays: 30, warrantyMonths: 12 },
    'newegg': { returnDays: 30, warrantyMonths: 12 },
};

/**
 * Universal defaults when store is unknown or not matched
 */
export const UNIVERSAL_DEFAULTS = {
    returnWindowDays: 30,
    warrantyMonths: 12,
    purchaseDate: getCurrentDateISO,  // Function - called at form init
} as const;

/**
 * Get smart defaults based on store name
 * Returns null for fields that should remain unchanged
 */
export function getStoreDefaults(storeName: string): {
    returnDays: number;
    warrantyMonths: number;
} | null {
    if (!storeName.trim()) {
        return null;
    }
    
    const normalized = storeName.toLowerCase().trim();
    
    // Check for exact match first
    if (STORE_DEFAULTS[normalized]) {
        return STORE_DEFAULTS[normalized];
    }
    
    // Check for partial match (e.g., "Amazon Fresh" matches "amazon")
    for (const [key, value] of Object.entries(STORE_DEFAULTS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value;
        }
    }
    
    return null;
}

/**
 * Default behavior ruleset
 * 
 * WHEN DEFAULTS ARE APPLIED:
 * - On form initialization: purchaseDate = today, return = 30, warranty = 12
 * - On store selection: If known store, update return/warranty to store policy
 * 
 * WHEN USERS CAN OVERRIDE:
 * - Any time via chip selection (return/warranty)
 * - Any time via date picker (purchase date)
 * - Store defaults show "(Store policy)" hint but don't lock
 * 
 * WHEN SYSTEM MUST ASK:
 * - Item name (always required, no default)
 * - Receipt photo (always required, no default)
 * 
 * CONFIRMATION RULES (v1.06-B):
 * - Archive: NO confirmation → show undo toast
 * - Delete: YES confirmation (destructive, irreversible)
 * - Remove photo (in form): NO confirmation (just remove, can re-add)
 * - Import backup: YES confirmation (merges data, needs awareness)
 */
export const BEHAVIOR_RULES = {
    // Fields that require user input (no default possible)
    requiredFields: ['name', 'photoUri'] as const,
    
    // Fields hidden by default in "More Details" section
    collapsedFields: ['store', 'price', 'serialNumber', 'notes'] as const,
    
    // Fields always visible in primary form
    primaryFields: ['photoUri', 'name', 'purchaseDate', 'returnWindowDays', 'warrantyMonths'] as const,
    
    // Actions that need confirmation dialog
    confirmationRequired: ['delete', 'importBackup'] as const,
    
    // Actions that use undo instead of confirmation
    undoInstead: ['archive', 'removePhotoInForm'] as const,
    
    // Undo window duration (milliseconds)
    undoWindowMs: 5000,
} as const;

/**
 * Form field visibility configuration
 */
export interface FieldVisibility {
    showMoreDetails: boolean;
}

/**
 * Get initial field visibility state
 * By default, hide optional fields to reduce cognitive load
 */
export function getInitialFieldVisibility(): FieldVisibility {
    return {
        showMoreDetails: false,
    };
}

/**
 * Check if a field should be visible given current visibility state
 */
export function isFieldVisible(
    fieldName: string,
    visibility: FieldVisibility
): boolean {
    const isPrimary = BEHAVIOR_RULES.primaryFields.includes(
        fieldName as typeof BEHAVIOR_RULES.primaryFields[number]
    );
    
    if (isPrimary) {
        return true;
    }
    
    const isCollapsed = BEHAVIOR_RULES.collapsedFields.includes(
        fieldName as typeof BEHAVIOR_RULES.collapsedFields[number]
    );
    
    if (isCollapsed) {
        return visibility.showMoreDetails;
    }
    
    return true;
}
