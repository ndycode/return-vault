/**
 * In-App Purchase Service
 * Handles purchase flow, restore, and validation
 * v1.1 Monetization
 *
 * Uses expo-iap for Expo SDK 54 compatibility
 * Note: IAP only works in development/production builds, not Expo Go
 */

import { Alert } from 'react-native';
import { useProStore } from '../store/proStore';
import { PRO_PRODUCT_ID } from '../types/pro';

// Type definitions for expo-iap (will be available when package is installed)
interface Product {
    id: string;
    title: string;
    description: string;
    displayPrice: string;
    price: number;
    currency: string;
}

interface Purchase {
    productId: string;
    transactionId: string;
    transactionDate: number;
    purchaseToken?: string;
}

// Mock types for development without expo-iap installed
type IAPHook = {
    connected: boolean;
    products: Product[];
    availablePurchases: Purchase[];
    fetchProducts: (params: { skus: string[]; type: string }) => Promise<void>;
    requestPurchase: (params: { request: { apple?: { sku: string }; google?: { skus: string[] } }; type: string }) => Promise<void>;
    finishTransaction: (params: { purchase: Purchase; isConsumable: boolean }) => Promise<void>;
    getAvailablePurchases: () => Promise<void>;
};

// Placeholder for expo-iap hook - will be replaced when package is installed
let useIAPHook: (callbacks?: {
    onPurchaseSuccess?: (purchase: Purchase) => void;
    onPurchaseError?: (error: Error) => void;
}) => IAPHook;

// Try to import expo-iap, fall back to mock if not installed
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const expoIap = require('expo-iap');
    useIAPHook = expoIap.useIAP;
} catch {
    // Mock implementation for development in Expo Go
    useIAPHook = () => ({
        connected: false,
        products: [],
        availablePurchases: [],
        fetchProducts: async () => {},
        requestPurchase: async () => {},
        finishTransaction: async () => {},
        getAvailablePurchases: async () => {},
    });
}

/**
 * Get localized price string
 * Fallback to $12.99 if not available
 */
export function getProPrice(products: Product[]): string {
    const product = products.find((p) => p.id === PRO_PRODUCT_ID);
    return product?.displayPrice ?? '$12.99';
}

/**
 * Purchase Pro unlock
 * Returns true if purchase initiated successfully
 */
export async function purchasePro(
    requestPurchase: IAPHook['requestPurchase']
): Promise<boolean> {
    try {
        await requestPurchase({
            request: {
                apple: { sku: PRO_PRODUCT_ID },
                google: { skus: [PRO_PRODUCT_ID] },
            },
            type: 'in-app',
        });
        return true;
    } catch (error) {
        console.error('[IAP] Purchase request failed:', error);
        return false;
    }
}

/**
 * Handle successful purchase
 * Grants Pro access and finishes transaction
 */
export async function handlePurchaseSuccess(
    purchase: Purchase,
    finishTransaction: IAPHook['finishTransaction']
): Promise<void> {
    console.log('[IAP] Purchase successful:', purchase.productId);

    // Grant Pro access
    useProStore.getState().setPro(true, purchase.productId);

    // Finish transaction (non-consumable)
    await finishTransaction({
        purchase,
        isConsumable: false,
    });

    Alert.alert(
        'Purchase Complete',
        'Pro features are now unlocked. Thank you for your support!'
    );
}

/**
 * Handle purchase error
 */
export function handlePurchaseError(error: Error & { code?: string }): void {
    console.error('[IAP] Purchase error:', error);

    // Don't show error for user cancellation
    if (error.code === 'user-cancelled' || error.message?.includes('cancel')) {
        return;
    }

    Alert.alert(
        'Purchase Failed',
        'Unable to complete purchase. Please try again.'
    );
}

/**
 * Restore previous purchases
 * Checks store for existing Pro purchase and grants access
 */
export async function restorePurchases(
    getAvailablePurchases: IAPHook['getAvailablePurchases'],
    availablePurchases: Purchase[],
    finishTransaction: IAPHook['finishTransaction']
): Promise<{ restored: boolean; message: string }> {
    try {
        await getAvailablePurchases();

        // Check for Pro purchase
        const proPurchase = availablePurchases.find(
            (p) => p.productId === PRO_PRODUCT_ID
        );

        if (proPurchase) {
            // Grant Pro access
            useProStore.getState().setPro(true, proPurchase.productId);

            // Finish any pending transactions
            await finishTransaction({
                purchase: proPurchase,
                isConsumable: false,
            });

            return {
                restored: true,
                message: 'Pro features restored successfully.',
            };
        }

        return {
            restored: false,
            message: 'No previous purchases found.',
        };
    } catch (error) {
        console.error('[IAP] Restore failed:', error);
        return {
            restored: false,
            message: 'Unable to restore purchases. Please try again.',
        };
    }
}

/**
 * Check if IAP is available
 * Returns false in Expo Go or simulator without StoreKit config
 */
export function isIAPAvailable(): boolean {
    // In development, we can simulate Pro for testing
    if (__DEV__) {
        return true;
    }

    // Check if expo-iap is installed
    try {
        require('expo-iap');
        return true;
    } catch {
        return false;
    }
}

/**
 * Development helper: Toggle Pro status for testing
 * Only works in __DEV__ mode
 */
export function devTogglePro(): void {
    if (!__DEV__) {
        console.warn('[IAP] devTogglePro only works in development');
        return;
    }

    const store = useProStore.getState();
    store.setPro(!store.isPro, 'dev_toggle');
    console.log('[IAP] Dev Pro status:', !store.isPro);
}

// Export the hook for use in components
export { useIAPHook as useIAP };
export type { Product, Purchase, IAPHook };
