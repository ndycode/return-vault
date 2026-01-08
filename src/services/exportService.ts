/**
 * Export Service
 * Handles proof packet and backup export/import
 * 
 * v1.06-D: System Confidence Layer
 * - All operations are non-destructive
 * - Import merges with existing data (never overwrites)
 * - Clear error messages with recovery paths
 * - Original data always preserved on failure
 */

import { Paths, Directory, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Purchase, Attachment } from '../types';
import { getPurchases } from '../db/repositories/purchaseRepository';
import { getAttachmentsByPurchaseId, getAllAttachments } from '../db/repositories/attachmentRepository';
import { createPurchase, createAttachment } from '../db';
import { generateUUID } from '../utils/uuid';
import { rescheduleNotificationsForPurchase } from './notificationService';
import { useSettingsStore } from '../store/settingsStore';

const BACKUP_VERSION = 1;

// Get export directory
function getExportDir(): Directory {
    return new Directory(Paths.cache, 'exports');
}

interface BackupData {
    version: number;
    exportDate: string;
    purchases: Purchase[];
    attachments: Attachment[];
}

interface ProofPacket {
    exportDate: string;
    purchase: Purchase;
    attachments: string[];
}

/**
 * Ensure export directory exists
 */
function ensureExportDir(): Directory {
    const exportDir = getExportDir();
    if (!exportDir.exists) {
        exportDir.create();
    }
    return exportDir;
}

/**
 * Clean up old exports
 */
function cleanupExports(): void {
    try {
        const exportDir = getExportDir();
        if (exportDir.exists) {
            exportDir.delete();
        }
    } catch (err) {
        console.error('Failed to cleanup exports:', err);
    }
}

/**
 * Generate proof packet for a single purchase
 */
export async function generateProofPacket(purchaseId: string): Promise<string | null> {
    try {
        const exportDir = ensureExportDir();

        // Get purchase and attachments
        const purchases = await getPurchases();
        const purchase = purchases.find((p) => p.id === purchaseId);
        if (!purchase) {
            throw new Error('Purchase not found');
        }

        const attachments = await getAttachmentsByPurchaseId(purchaseId);

        // Create proof folder
        const folderName = `proof-${purchase.name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
        const proofDir = new Directory(exportDir, folderName);
        proofDir.create();

        // Copy attachments
        const attachmentNames: string[] = [];
        for (let i = 0; i < attachments.length; i++) {
            const att = attachments[i];
            const filename = `${att.type}-${i + 1}.jpg`;
            const sourceFile = new File(att.uri);
            const destFile = new File(proofDir, filename);

            if (sourceFile.exists) {
                sourceFile.copy(destFile);
                attachmentNames.push(filename);
            }
        }

        // Create summary JSON
        const packet: ProofPacket = {
            exportDate: new Date().toISOString(),
            purchase,
            attachments: attachmentNames,
        };

        const summaryFile = new File(proofDir, 'summary.json');
        summaryFile.create();
        summaryFile.write(JSON.stringify(packet, null, 2));

        return summaryFile.uri;
    } catch (err) {
        console.error('Failed to generate proof packet:', err);
        return null;
    }
}

/**
 * Share proof packet
 */
export async function shareProofPacket(purchaseId: string): Promise<boolean> {
    const summaryPath = await generateProofPacket(purchaseId);
    if (!summaryPath) {
        return false;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        console.error('Sharing not available');
        return false;
    }

    await Sharing.shareAsync(summaryPath, {
        mimeType: 'application/json',
        dialogTitle: 'Share Proof Packet',
    });

    return true;
}

/**
 * Generate full backup
 */
export async function generateBackup(): Promise<string | null> {
    try {
        const exportDir = ensureExportDir();

        const purchases = await getPurchases();
        const attachments = await getAllAttachments();

        const backup: BackupData = {
            version: BACKUP_VERSION,
            exportDate: new Date().toISOString(),
            purchases,
            attachments,
        };

        const filename = `warranty-locker-backup-${Date.now()}.json`;
        const backupFile = new File(exportDir, filename);
        backupFile.create();
        backupFile.write(JSON.stringify(backup, null, 2));

        return backupFile.uri;
    } catch (err) {
        console.error('Failed to generate backup:', err);
        return null;
    }
}

/**
 * Share backup file
 * Updates last backup date on success (v1.06-D)
 */
export async function shareBackup(): Promise<boolean> {
    const backupPath = await generateBackup();
    if (!backupPath) {
        return false;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        console.error('Sharing not available');
        return false;
    }

    await Sharing.shareAsync(backupPath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Backup',
    });

    // Track backup date for freshness indicator
    useSettingsStore.getState().setLastBackupDate(new Date().toISOString());

    return true;
}

/**
 * Pick and import backup file
 * 
 * SAFETY GUARANTEES (v1.06-D):
 * - NEVER deletes existing data
 * - Merge-only operation (adds to existing)
 * - Each item imported independently (one failure doesn't stop others)
 * - Returns count of successfully imported items
 * - Original data unchanged on any failure
 */
export async function importBackup(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled || result.assets.length === 0) {
            return { success: false, count: 0, error: 'No file selected' };
        }

        const fileUri = result.assets[0].uri;
        const importedFile = new File(fileUri);
        
        // Safely read file content
        let content: string;
        try {
            content = await importedFile.text();
        } catch (readErr) {
            console.error('Failed to read backup file:', readErr);
            return { success: false, count: 0, error: 'Could not read file' };
        }
        
        // Safely parse JSON
        let backup: BackupData;
        try {
            backup = JSON.parse(content);
        } catch (parseErr) {
            console.error('Failed to parse backup JSON:', parseErr);
            return { success: false, count: 0, error: 'Invalid backup format' };
        }

        // Validate version
        if (backup.version !== BACKUP_VERSION) {
            return {
                success: false,
                count: 0,
                error: `Backup version ${backup.version} not compatible`
            };
        }

        // Import purchases (merge - never replace)
        // Each item is independent - one failure doesn't affect others
        let importCount = 0;
        const errors: string[] = [];
        
        for (const purchase of backup.purchases) {
            try {
                const newPurchase = await createPurchase({
                    name: purchase.name,
                    store: purchase.store ?? undefined,
                    price: purchase.price ?? undefined,
                    currency: purchase.currency ?? undefined,
                    purchaseDate: purchase.purchaseDate,
                    returnWindowDays: purchase.returnWindowDays ?? undefined,
                    warrantyMonths: purchase.warrantyMonths ?? undefined,
                    serialNumber: purchase.serialNumber ?? undefined,
                    notes: purchase.notes ?? undefined,
                });

                // Reschedule notifications
                await rescheduleNotificationsForPurchase(newPurchase);
                importCount++;
            } catch (err) {
                console.error('Failed to import purchase:', purchase.name, err);
                errors.push(purchase.name);
            }
        }

        // Return success even if some items failed (partial import is valid)
        if (importCount > 0) {
            return { success: true, count: importCount };
        }
        
        // All items failed
        return { 
            success: false, 
            count: 0, 
            error: 'No items could be imported' 
        };
    } catch (err) {
        console.error('Failed to import backup:', err);
        return { success: false, count: 0, error: 'Import failed. Original data unchanged.' };
    }
}
