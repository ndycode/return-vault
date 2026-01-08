/**
 * Attachment Repository
 * CRUD operations for attachments table
 */

import { getDatabase } from '../database';
import { Attachment, CreateAttachmentInput } from '../../types';
import { generateUUID } from '../../utils/uuid';
import { getCurrentDateTimeISO } from '../../utils/dateUtils';

/**
 * Create a new attachment
 */
export async function createAttachment(input: CreateAttachmentInput): Promise<Attachment> {
    const db = await getDatabase();
    const now = getCurrentDateTimeISO();
    const id = generateUUID();

    const attachment: Attachment = {
        id,
        purchaseId: input.purchaseId,
        type: input.type,
        uri: input.uri,
        createdAt: now,
    };

    await db.runAsync(
        `INSERT INTO attachments (id, purchaseId, type, uri, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
        [
            attachment.id,
            attachment.purchaseId,
            attachment.type,
            attachment.uri,
            attachment.createdAt,
        ]
    );

    return attachment;
}

/**
 * Get attachment by ID
 */
export async function getAttachmentById(id: string): Promise<Attachment | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Attachment>(
        'SELECT * FROM attachments WHERE id = ?',
        [id]
    );
    return result ?? null;
}

/**
 * Get all attachments for a purchase
 */
export async function getAttachmentsByPurchaseId(purchaseId: string): Promise<Attachment[]> {
    const db = await getDatabase();
    return db.getAllAsync<Attachment>(
        'SELECT * FROM attachments WHERE purchaseId = ? ORDER BY createdAt ASC',
        [purchaseId]
    );
}

/**
 * Get attachments by type for a purchase
 */
export async function getAttachmentsByType(
    purchaseId: string,
    type: Attachment['type']
): Promise<Attachment[]> {
    const db = await getDatabase();
    return db.getAllAsync<Attachment>(
        'SELECT * FROM attachments WHERE purchaseId = ? AND type = ? ORDER BY createdAt ASC',
        [purchaseId, type]
    );
}

/**
 * Delete an attachment
 */
export async function deleteAttachment(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM attachments WHERE id = ?', [id]);
    return result.changes > 0;
}

/**
 * Delete all attachments for a purchase
 * Note: This is also handled by CASCADE on purchase delete
 */
export async function deleteAttachmentsByPurchaseId(purchaseId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
        'DELETE FROM attachments WHERE purchaseId = ?',
        [purchaseId]
    );
    return result.changes;
}

/**
 * Get total attachment count
 */
export async function getAttachmentCount(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM attachments'
    );
    return result?.count ?? 0;
}

/**
 * Get all attachments (for backup export)
 */
export async function getAllAttachments(): Promise<Attachment[]> {
    const db = await getDatabase();
    return db.getAllAsync<Attachment>(
        'SELECT * FROM attachments ORDER BY createdAt ASC'
    );
}
