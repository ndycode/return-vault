/**
 * Pro Features Utility
 * Central helper for checking paid feature access
 * v1.1 Monetization
 */

import { useProStore } from '../store/proStore';
import { PaidFeature, FREE_PURCHASE_LIMIT } from '../types/pro';
import { getPurchaseCounts } from '../db/repositories/purchaseRepository';

/**
 * Check if user can use a paid feature
 * Synchronous check against current Pro status
 */
export function canUse(feature: PaidFeature): boolean {
    const isPro = useProStore.getState().isPro;

    // Pro users have access to all features
    if (isPro) {
        return true;
    }

    // Free tier: only basic features allowed
    switch (feature) {
        case 'unlimited_purchases':
            // This needs async check - use canAddPurchase() instead
            return false;
        case 'proof_packet_export':
            return false;
        case 'backup_export':
            return false;
        case 'backup_import':
            return false;
        case 'advanced_notifications':
            return false;
        default:
            return false;
    }
}

/**
 * Check if user can add another purchase
 * Returns { allowed: boolean, currentCount: number, limit: number }
 */
export async function canAddPurchase(): Promise<{
    allowed: boolean;
    currentCount: number;
    limit: number;
}> {
    const isPro = useProStore.getState().isPro;

    if (isPro) {
        return { allowed: true, currentCount: 0, limit: Infinity };
    }

    const counts = await getPurchaseCounts();
    const currentCount = counts.active;
    const allowed = currentCount < FREE_PURCHASE_LIMIT;

    return {
        allowed,
        currentCount,
        limit: FREE_PURCHASE_LIMIT,
    };
}

/**
 * Get remaining free purchases
 */
export async function getRemainingFreePurchases(): Promise<number> {
    const isPro = useProStore.getState().isPro;

    if (isPro) {
        return Infinity;
    }

    const counts = await getPurchaseCounts();
    return Math.max(0, FREE_PURCHASE_LIMIT - counts.active);
}

/**
 * Hook-friendly version for React components
 */
export function useCanUse(feature: PaidFeature): boolean {
    const isPro = useProStore((s) => s.isPro);

    if (isPro) {
        return true;
    }

    // Free tier restrictions
    switch (feature) {
        case 'proof_packet_export':
        case 'backup_export':
        case 'backup_import':
        case 'advanced_notifications':
        case 'unlimited_purchases':
            return false;
        default:
            return false;
    }
}
