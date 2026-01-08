/**
 * Purchase Repository
 * CRUD operations for purchases table
 */

import { getDatabase } from '../database';
import {
    Purchase,
    CreatePurchaseInput,
    UpdatePurchaseInput,
    PurchaseStatus
} from '../../types';
import { generateUUID } from '../../utils/uuid';
import {
    computeReturnDeadline,
    computeWarrantyExpiry,
    getCurrentDateTimeISO
} from '../../utils/dateUtils';

/**
 * Create a new purchase
 */
export async function createPurchase(input: CreatePurchaseInput): Promise<Purchase> {
    const db = await getDatabase();
    const now = getCurrentDateTimeISO();
    const id = generateUUID();

    // Compute deadlines
    const returnDeadline = input.returnWindowDays
        ? computeReturnDeadline(input.purchaseDate, input.returnWindowDays)
        : null;
    const warrantyExpiry = input.warrantyMonths
        ? computeWarrantyExpiry(input.purchaseDate, input.warrantyMonths)
        : null;

    const purchase: Purchase = {
        id,
        name: input.name,
        store: input.store ?? null,
        price: input.price ?? null,
        currency: input.currency ?? 'USD',
        purchaseDate: input.purchaseDate,
        returnWindowDays: input.returnWindowDays ?? null,
        returnDeadline,
        warrantyMonths: input.warrantyMonths ?? null,
        warrantyExpiry,
        serialNumber: input.serialNumber ?? null,
        notes: input.notes ?? null,
        status: 'active',
        notificationIds: null,
        createdAt: now,
        updatedAt: now,
    };

    await db.runAsync(
        `INSERT INTO purchases (
      id, name, store, price, currency, purchaseDate, 
      returnWindowDays, returnDeadline, warrantyMonths, warrantyExpiry,
      serialNumber, notes, status, notificationIds, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            purchase.id,
            purchase.name,
            purchase.store,
            purchase.price,
            purchase.currency,
            purchase.purchaseDate,
            purchase.returnWindowDays,
            purchase.returnDeadline,
            purchase.warrantyMonths,
            purchase.warrantyExpiry,
            purchase.serialNumber,
            purchase.notes,
            purchase.status,
            purchase.notificationIds,
            purchase.createdAt,
            purchase.updatedAt,
        ]
    );

    return purchase;
}

/**
 * Get a purchase by ID
 */
export async function getPurchaseById(id: string): Promise<Purchase | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Purchase>(
        'SELECT * FROM purchases WHERE id = ?',
        [id]
    );
    return result ?? null;
}

/**
 * Get all purchases with optional filters
 */
export async function getPurchases(options?: {
    status?: PurchaseStatus;
    store?: string;
    orderBy?: 'returnDeadline' | 'warrantyExpiry' | 'purchaseDate' | 'createdAt';
    orderDirection?: 'ASC' | 'DESC';
}): Promise<Purchase[]> {
    const db = await getDatabase();

    let query = 'SELECT * FROM purchases WHERE 1=1';
    const params: (string | null)[] = [];

    if (options?.status) {
        query += ' AND status = ?';
        params.push(options.status);
    }

    if (options?.store) {
        query += ' AND store = ?';
        params.push(options.store);
    }

    const orderBy = options?.orderBy ?? 'createdAt';
    const orderDirection = options?.orderDirection ?? 'DESC';

    // Handle null values in ordering - put nulls last
    if (orderBy === 'returnDeadline' || orderBy === 'warrantyExpiry') {
        query += ` ORDER BY ${orderBy} IS NULL, ${orderBy} ${orderDirection}`;
    } else {
        query += ` ORDER BY ${orderBy} ${orderDirection}`;
    }

    return db.getAllAsync<Purchase>(query, params);
}

/**
 * Get active purchases with deadlines for Action Today
 */
export async function getActionItems(): Promise<{
    returnDueSoon: Purchase[];
    warrantyExpiringSoon: Purchase[];
    overdue: Purchase[];
}> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];

    // Return overdue (deadline passed, still active)
    const overdue = await db.getAllAsync<Purchase>(
        `SELECT * FROM purchases 
     WHERE status = 'active' 
     AND returnDeadline IS NOT NULL 
     AND returnDeadline < ?
     ORDER BY returnDeadline ASC`,
        [today]
    );

    // Return due soon (within 7 days, not overdue)
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const sevenDaysStr = sevenDaysLater.toISOString().split('T')[0];

    const returnDueSoon = await db.getAllAsync<Purchase>(
        `SELECT * FROM purchases 
     WHERE status = 'active' 
     AND returnDeadline IS NOT NULL 
     AND returnDeadline >= ? 
     AND returnDeadline <= ?
     ORDER BY returnDeadline ASC`,
        [today, sevenDaysStr]
    );

    // Warranty expiring soon (within 30 days)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysStr = thirtyDaysLater.toISOString().split('T')[0];

    const warrantyExpiringSoon = await db.getAllAsync<Purchase>(
        `SELECT * FROM purchases 
     WHERE status = 'active' 
     AND warrantyExpiry IS NOT NULL 
     AND warrantyExpiry >= ? 
     AND warrantyExpiry <= ?
     ORDER BY warrantyExpiry ASC`,
        [today, thirtyDaysStr]
    );

    return { returnDueSoon, warrantyExpiringSoon, overdue };
}

/**
 * Search purchases by name or store
 */
export async function searchPurchases(query: string): Promise<Purchase[]> {
    const db = await getDatabase();
    const searchTerm = `%${query}%`;

    return db.getAllAsync<Purchase>(
        `SELECT * FROM purchases 
     WHERE (name LIKE ? OR store LIKE ?)
     ORDER BY createdAt DESC`,
        [searchTerm, searchTerm]
    );
}

/**
 * Update a purchase
 */
export async function updatePurchase(
    id: string,
    input: UpdatePurchaseInput
): Promise<Purchase | null> {
    const db = await getDatabase();
    const existing = await getPurchaseById(id);

    if (!existing) {
        return null;
    }

    const now = getCurrentDateTimeISO();

    // Recompute deadlines if dates/windows changed
    let returnDeadline = existing.returnDeadline;
    let warrantyExpiry = existing.warrantyExpiry;

    const purchaseDate = input.purchaseDate ?? existing.purchaseDate;
    const returnWindowDays = input.returnWindowDays !== undefined
        ? input.returnWindowDays
        : existing.returnWindowDays;
    const warrantyMonths = input.warrantyMonths !== undefined
        ? input.warrantyMonths
        : existing.warrantyMonths;

    if (returnWindowDays) {
        returnDeadline = computeReturnDeadline(purchaseDate, returnWindowDays);
    } else if (input.returnWindowDays === null) {
        returnDeadline = null;
    }

    if (warrantyMonths) {
        warrantyExpiry = computeWarrantyExpiry(purchaseDate, warrantyMonths);
    } else if (input.warrantyMonths === null) {
        warrantyExpiry = null;
    }

    const updated: Purchase = {
        ...existing,
        name: input.name ?? existing.name,
        store: input.store !== undefined ? input.store : existing.store,
        price: input.price !== undefined ? input.price : existing.price,
        currency: input.currency !== undefined ? input.currency : existing.currency,
        purchaseDate,
        returnWindowDays,
        returnDeadline,
        warrantyMonths,
        warrantyExpiry,
        serialNumber: input.serialNumber !== undefined ? input.serialNumber : existing.serialNumber,
        notes: input.notes !== undefined ? input.notes : existing.notes,
        status: input.status ?? existing.status,
        notificationIds: input.notificationIds !== undefined ? input.notificationIds : existing.notificationIds,
        updatedAt: now,
    };

    await db.runAsync(
        `UPDATE purchases SET
      name = ?, store = ?, price = ?, currency = ?, purchaseDate = ?,
      returnWindowDays = ?, returnDeadline = ?, warrantyMonths = ?, warrantyExpiry = ?,
      serialNumber = ?, notes = ?, status = ?, notificationIds = ?, updatedAt = ?
     WHERE id = ?`,
        [
            updated.name,
            updated.store,
            updated.price,
            updated.currency,
            updated.purchaseDate,
            updated.returnWindowDays,
            updated.returnDeadline,
            updated.warrantyMonths,
            updated.warrantyExpiry,
            updated.serialNumber,
            updated.notes,
            updated.status,
            updated.notificationIds,
            updated.updatedAt,
            id,
        ]
    );

    return updated;
}

/**
 * Archive a purchase
 */
export async function archivePurchase(id: string): Promise<boolean> {
    const result = await updatePurchase(id, { status: 'archived' });
    return result !== null;
}

/**
 * Delete a purchase (hard delete)
 */
export async function deletePurchase(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM purchases WHERE id = ?', [id]);
    return result.changes > 0;
}

/**
 * Get all unique stores for autocomplete
 */
export async function getUniqueStores(): Promise<string[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<{ store: string }>(
        `SELECT DISTINCT store FROM purchases 
     WHERE store IS NOT NULL AND store != ''
     ORDER BY store ASC`
    );
    return results.map((r) => r.store);
}

/**
 * Get purchase count by status
 */
export async function getPurchaseCounts(): Promise<{
    total: number;
    active: number;
    archived: number;
}> {
    const db = await getDatabase();

    const total = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM purchases'
    );
    const active = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM purchases WHERE status = 'active'"
    );
    const archived = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM purchases WHERE status = 'archived'"
    );

    return {
        total: total?.count ?? 0,
        active: active?.count ?? 0,
        archived: archived?.count ?? 0,
    };
}
