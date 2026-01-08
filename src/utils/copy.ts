/**
 * System Confidence Layer - Copy Constants
 * v1.06-D: Enterprise-grade messaging
 * 
 * COPY RULES:
 * - Calm, neutral, actionable
 * - No blame, no excitement
 * - Factual over emotional
 * - Short over verbose
 * 
 * ANTI-PATTERNS:
 * - "Success! 🎉" → "Item saved"
 * - "Oops, something went wrong" → "Couldn't complete. Try again."
 * - "Welcome to Pro!" → "Pro unlocked"
 * - "Failed to..." → "Couldn't [action]. [Recovery path]."
 */

// ─────────────────────────────────────────────
// VALIDATION MESSAGES
// ─────────────────────────────────────────────
export const VALIDATION = {
    REQUIRED_NAME: 'Item name required',
    REQUIRED_PHOTO: 'Add a receipt photo to continue',
} as const;

// ─────────────────────────────────────────────
// SUCCESS CONFIRMATIONS (minimal, factual)
// ─────────────────────────────────────────────
export const SUCCESS = {
    ITEM_SAVED: 'Item saved',
    ITEM_ARCHIVED: 'Item archived',
    ITEM_DELETED: 'Item deleted',
    BACKUP_EXPORTED: 'Backup exported',
    BACKUP_IMPORTED: (count: number) => `${count} item${count !== 1 ? 's' : ''} imported`,
    PRO_UNLOCKED: 'Pro unlocked',
    PRO_RESTORED: 'Pro restored',
    PROOF_SHARED: 'Proof shared',
} as const;

// ─────────────────────────────────────────────
// ERROR MESSAGES (no blame, recovery-focused)
// ─────────────────────────────────────────────
export const ERROR = {
    // Generic fallback
    GENERIC: 'Something unexpected happened. Try again.',
    
    // Save operations
    SAVE_FAILED: 'Couldn\'t save. Your data is safe. Try again.',
    LOAD_FAILED: 'Couldn\'t load item. Pull down to refresh.',
    
    // Archive/Delete
    ARCHIVE_FAILED: 'Couldn\'t archive. Item unchanged.',
    DELETE_FAILED: 'Couldn\'t delete. Item unchanged.',
    
    // Export operations
    EXPORT_FAILED: 'Couldn\'t export. Your data is safe locally.',
    SHARE_FAILED: 'Couldn\'t share. Try again.',
    SHARE_UNAVAILABLE: 'Sharing not available on this device.',
    
    // Backup operations
    BACKUP_FAILED: 'Couldn\'t create backup. Try again.',
    IMPORT_FAILED: 'Couldn\'t import. Original data unchanged.',
    IMPORT_VERSION_MISMATCH: (version: number) => `Backup version ${version} not compatible. Original data unchanged.`,
    IMPORT_PARSE_FAILED: 'Couldn\'t read backup file. Check file format.',
    
    // IAP operations
    PURCHASE_FAILED: 'Purchase couldn\'t complete. Try again.',
    RESTORE_FAILED: 'Couldn\'t restore. Check your connection.',
    NO_PURCHASE_FOUND: 'No previous purchase found.',
    
    // Network/Connection
    CONNECTION_FAILED: 'Connection issue. Check your network.',
} as const;

// ─────────────────────────────────────────────
// ALERT TITLES (short, factual)
// ─────────────────────────────────────────────
export const ALERT_TITLES = {
    // Neutral titles (no emotional weight)
    INFO: 'Notice',
    CONFIRM: 'Confirm',
    ERROR: 'Issue',
    
    // Action-specific (factual)
    ARCHIVE: 'Archive Item',
    DELETE: 'Delete Item',
    IMPORT: 'Import Backup',
    
    // Pro-related
    PRO_FEATURE: 'Pro Feature',
    PRO_UNLOCKED: 'Pro Unlocked',
    RESTORE: 'Restore Purchase',
} as const;

// ─────────────────────────────────────────────
// CONFIRMATION DIALOGS (clear, actionable)
// ─────────────────────────────────────────────
export const CONFIRM = {
    ARCHIVE: {
        title: 'Archive Item',
        message: 'Item moves to archive. You can still view it there.',
        confirm: 'Archive',
        cancel: 'Cancel',
    },
    DELETE: {
        title: 'Delete Item',
        message: 'This removes the item and attachments permanently.',
        confirm: 'Delete',
        cancel: 'Cancel',
    },
    IMPORT: {
        title: 'Import Backup',
        message: 'This adds items from the backup to your existing data.',
        confirm: 'Import',
        cancel: 'Cancel',
    },
} as const;

// ─────────────────────────────────────────────
// PASSIVE REASSURANCE (subtle, in-context)
// ─────────────────────────────────────────────
export const REASSURANCE = {
    // Storage
    SAVED_LOCALLY: 'Saved on this device',
    DATA_SAFE: 'Your data is safe',
    
    // Notifications
    REMINDERS_SET: 'Reminders scheduled',
    REMINDERS_UPDATED: 'Reminders updated',
    
    // Backup
    BACKUP_FRESH: 'Last backup: Today',
    BACKUP_RECENT: (days: number) => `Last backup: ${days} day${days !== 1 ? 's' : ''} ago`,
    BACKUP_NEVER: 'No backup yet',
    
    // Pro status
    PRO_ACTIVE: 'Pro',
    
    // Recovery affordances
    CAN_UNDO: 'Can be undone',
    STILL_VIEWABLE: 'Still viewable in archive',
} as const;

// ─────────────────────────────────────────────
// SYSTEM STATE (factual status)
// ─────────────────────────────────────────────
export const STATUS = {
    // Notifications
    NOTIFICATIONS_ENABLED: 'Notifications on',
    NOTIFICATIONS_DISABLED: 'Notifications off',
    
    // Permission states
    PERMISSION_GRANTED: 'Enabled',
    PERMISSION_DENIED: 'Disabled',
    PERMISSION_PENDING: 'Not set',
} as const;
