/**
 * Pro/Paid Feature Type Definitions
 * v1.1 Monetization
 */

/**
 * Pro features enum - used for feature gating
 */
export type ProFeature =
    | 'UNLIMITED_ITEMS'
    | 'EXPORT_PROOF'
    | 'BACKUP'
    | 'ADV_NOTIF';

/**
 * Paid features that require Pro unlock
 */
export type PaidFeature =
    | 'unlimited_purchases'
    | 'proof_packet_export'
    | 'backup_export'
    | 'backup_import'
    | 'advanced_notifications';

/**
 * Free tier limits
 */
export const FREE_ITEM_LIMIT = 10;
export const FREE_PURCHASE_LIMIT = 10; // Alias for compatibility

/**
 * Product ID for App Store / Google Play
 */
export const PRO_SKU = 'com.warrantylocker.pro';
export const PRO_PRODUCT_ID = 'com.warrantylocker.pro'; // Alias for compatibility

/**
 * Pro feature descriptions for UI
 */
export const PRO_FEATURES: { feature: ProFeature; title: string; description: string }[] = [
    {
        feature: 'UNLIMITED_ITEMS',
        title: 'Unlimited Items',
        description: 'Track as many purchases as you need',
    },
    {
        feature: 'EXPORT_PROOF',
        title: 'Export Proof Packets',
        description: 'Share receipts and warranty info',
    },
    {
        feature: 'BACKUP',
        title: 'Backup & Restore',
        description: 'Export and import your data',
    },
    {
        feature: 'ADV_NOTIF',
        title: 'Advanced Reminders',
        description: 'Custom notification schedules',
    },
];

export interface ProState {
    isPro: boolean;
    iapLastCheckedAt: string | null;
}
