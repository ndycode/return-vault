/**
 * In-App Purchase Module
 * Handles IAP connection, purchasing, restoring, and cleanup
 * Uses expo-iap for Expo compatibility
 */

import { Platform } from 'react-native';
import { PRO_SKU } from '../types/pro';
import { useSettingsStore } from '../store/settingsStore';
import { iapLog } from './debug';

// IAP types (will be provided by expo-iap when installed)
interface Product {
    productId: string;
    title: string;
    description: string;
    price: string;
    localizedPrice: string;
    currency: string;
}

interface Purchase {
    productId: string;
    transactionId: string;
    transactionDate: number;
    purchaseToken?: string; // Android
    transactionReceipt?: string; // iOS
}

type PurchaseResult = {
    success: boolean;
    error?: 'USER_CANCELED' | 'PURCHASE_FAILED' | 'NETWORK_ERROR' | 'UNKNOWN';
    purchase?: Purchase;
};

type RestoreResult = {
    success: boolean;
    hasPro: boolean;
    error?: string;
};

// Module state
let isConnected = false;
let proProduct: Product | null = null;

/**
 * Check if expo-iap is available
 * Returns false for development builds without expo-iap
 */
function isIAPAvailable(): boolean {
    try {
        // In production, expo-iap would be required
        // For now, we'll use a mock flag for development
        return Platform.OS === 'ios' || Platform.OS === 'android';
    } catch {
        return false;
    }
}

/**
 * Initialize IAP connection
 * Must be called on app start (e.g., in App.tsx useEffect)
 */
export async function initConnection(): Promise<boolean> {
    if (!isIAPAvailable()) {
        iapLog.log('Not available on this platform');
        return false;
    }

    if (isConnected) {
        return true;
    }

    try {
        // In production with expo-iap:
        // await IapModule.initConnection();
        // const products = await IapModule.getProducts([PRO_SKU]);
        // proProduct = products[0] ?? null;
        
        // Mock for development - simulates successful connection
        iapLog.log('Connection initialized');
        isConnected = true;
        return true;
    } catch (error) {
        iapLog.error('Failed to initialize', error);
        isConnected = false;
        return false;
    }
}

/**
 * End IAP connection
 * Call on app unmount for cleanup
 */
export async function endConnection(): Promise<void> {
    if (!isConnected) {
        return;
    }

    try {
        // In production with expo-iap:
        // await IapModule.endConnection();
        
        iapLog.log('Connection ended');
        isConnected = false;
        proProduct = null;
    } catch (error) {
        iapLog.error('Failed to end connection', error);
    }
}

/**
 * Get Pro product info
 * Returns null if not connected or product not found
 */
export function getProProduct(): Product | null {
    return proProduct;
}

/**
 * Purchase Pro upgrade
 * Handles the full purchase flow including finishing transaction
 */
export async function purchasePro(): Promise<PurchaseResult> {
    if (!isConnected) {
        const connected = await initConnection();
        if (!connected) {
            return { success: false, error: 'NETWORK_ERROR' };
        }
    }

    try {
        // In production with expo-iap:
        // const purchase = await IapModule.requestPurchase(PRO_SKU);
        // 
        // if (!purchase) {
        //     // User canceled
        //     return { success: false, error: 'USER_CANCELED' };
        // }
        //
        // // CRITICAL: Finish the transaction to acknowledge with store
        // await IapModule.finishTransaction(purchase.transactionId);
        //
        // Update store
        // useSettingsStore.getState().setPro(true);
        //
        // return { success: true, purchase };

        // Mock for development
        iapLog.log('Simulating purchase...');
        
        // Simulate user decision (in real app, this comes from store UI)
        // For dev, we'll just succeed
        const mockPurchase: Purchase = {
            productId: PRO_SKU,
            transactionId: `mock_txn_${Date.now()}`,
            transactionDate: Date.now(),
        };

        // Update pro status
        useSettingsStore.getState().setPro(true);
        
        return { success: true, purchase: mockPurchase };
    } catch (error: unknown) {
        const err = error as Error & { code?: string };
        iapLog.error('Purchase failed', error);
        
        // Check for user cancellation
        if (err.code === 'E_USER_CANCELLED' || 
            err.message?.includes('cancel')) {
            // Handle canceled silently - no error shown to user
            return { success: false, error: 'USER_CANCELED' };
        }
        
        return { success: false, error: 'PURCHASE_FAILED' };
    }
}

/**
 * Restore previous purchases
 * Required by App Store - must provide a Restore button
 */
export async function restorePro(): Promise<RestoreResult> {
    if (!isConnected) {
        const connected = await initConnection();
        if (!connected) {
            return { success: false, hasPro: false, error: 'Failed to connect to store' };
        }
    }

    try {
        // In production with expo-iap:
        // const purchases = await IapModule.getAvailablePurchases();
        // const hasPro = purchases.some(p => p.productId === PRO_SKU);
        //
        // if (hasPro) {
        //     // Finish all restored transactions
        //     for (const purchase of purchases) {
        //         if (purchase.productId === PRO_SKU) {
        //             await IapModule.finishTransaction(purchase.transactionId);
        //         }
        //     }
        //     useSettingsStore.getState().setPro(true);
        // }
        //
        // return { success: true, hasPro };

        // Mock for development
        iapLog.log('Simulating restore...');
        
        // Check if already pro (from a previous mock purchase)
        const currentIsPro = useSettingsStore.getState().isPro;
        
        return { success: true, hasPro: currentIsPro };
    } catch (error) {
        iapLog.error('Restore failed', error);
        return { success: false, hasPro: false, error: 'Failed to restore purchases' };
    }
}

/**
 * Check if user has Pro on fresh install
 * Called during app initialization to sync store with IAP status
 */
export async function checkProStatus(): Promise<boolean> {
    // Pro status persists offline - check local first
    const localIsPro = useSettingsStore.getState().isPro;
    if (localIsPro) {
        return true;
    }

    // If not marked as pro locally, try to restore
    // This handles fresh installs where user previously purchased
    try {
        const result = await restorePro();
        return result.hasPro;
    } catch {
        // Offline - keep whatever local state we have
        return localIsPro;
    }
}

/**
 * Get formatted price for Pro upgrade
 */
export function getProPrice(): string {
    if (proProduct) {
        return proProduct.localizedPrice;
    }
    // Fallback price (actual price comes from store)
    return '$4.99';
}
