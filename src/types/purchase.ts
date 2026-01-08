/**
 * Purchase Type Definition
 */

export type PurchaseStatus = 'active' | 'archived';

export interface Purchase {
    id: string;
    name: string;
    store: string | null;
    price: number | null;
    currency: string | null;
    purchaseDate: string; // ISO date string
    returnWindowDays: number | null;
    returnDeadline: string | null; // ISO date string
    warrantyMonths: number | null;
    warrantyExpiry: string | null; // ISO date string
    serialNumber: string | null;
    notes: string | null;
    status: PurchaseStatus;
    notificationIds: string | null; // JSON array string
    createdAt: string; // ISO datetime string
    updatedAt: string; // ISO datetime string
}

export interface CreatePurchaseInput {
    name: string;
    store?: string;
    price?: number;
    currency?: string;
    purchaseDate: string;
    returnWindowDays?: number;
    warrantyMonths?: number;
    serialNumber?: string;
    notes?: string;
}

export interface UpdatePurchaseInput {
    name?: string;
    store?: string | null;
    price?: number | null;
    currency?: string | null;
    purchaseDate?: string;
    returnWindowDays?: number | null;
    warrantyMonths?: number | null;
    serialNumber?: string | null;
    notes?: string | null;
    status?: PurchaseStatus;
    notificationIds?: string | null;
}
