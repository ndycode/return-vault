/**
 * Urgency Classification Utility
 * Central source of truth for urgency tiers across the app
 *
 * URGENCY TIERS:
 * - URGENT (red): Requires action now. Overdue or due within critical window.
 * - UPCOMING (yellow): Awareness needed. Action within planning horizon.
 * - REFERENCE (gray): Historical or far-future. Can be ignored for daily decisions.
 *
 * THRESHOLDS:
 * - Return URGENT: <= 3 days (or overdue)
 * - Return UPCOMING: 4-14 days
 * - Warranty URGENT: <= 7 days (or overdue)
 * - Warranty UPCOMING: 8-30 days
 */

import { Purchase } from '../types';
import { daysUntil } from './dateUtils';

/**
 * Urgency tier enum
 */
export type UrgencyTier = 'urgent' | 'upcoming' | 'reference';

/**
 * Thresholds for urgency classification (in days)
 * Single source of truth - modify here to change app-wide behavior
 */
export const URGENCY_THRESHOLDS = {
    /** Return: urgent if <= this many days */
    RETURN_URGENT_DAYS: 3,
    /** Return: upcoming if <= this many days (and > urgent) */
    RETURN_UPCOMING_DAYS: 14,
    /** Warranty: urgent if <= this many days */
    WARRANTY_URGENT_DAYS: 7,
    /** Warranty: upcoming if <= this many days (and > urgent) */
    WARRANTY_UPCOMING_DAYS: 30,
} as const;

/**
 * Urgency classification result
 */
export interface UrgencyClassification {
    tier: UrgencyTier;
    /** Most critical deadline type driving the urgency */
    primaryDeadline: 'return' | 'warranty' | null;
    /** Days until primary deadline (negative = overdue) */
    daysRemaining: number | null;
    /** Whether the item is overdue */
    isOverdue: boolean;
}

/**
 * Classify a single deadline
 */
function classifyDeadline(
    deadline: string | null,
    urgentThreshold: number,
    upcomingThreshold: number
): { tier: UrgencyTier; days: number | null } {
    if (!deadline) {
        return { tier: 'reference', days: null };
    }

    const days = daysUntil(deadline);

    if (days < 0) {
        // Overdue
        return { tier: 'urgent', days };
    }

    if (days <= urgentThreshold) {
        return { tier: 'urgent', days };
    }

    if (days <= upcomingThreshold) {
        return { tier: 'upcoming', days };
    }

    return { tier: 'reference', days };
}

/**
 * Get the urgency classification for a purchase
 * Considers both return deadline and warranty expiry, returns the most urgent
 */
export function getUrgencyClassification(purchase: Purchase): UrgencyClassification {
    // Archived items are always reference
    if (purchase.status === 'archived') {
        return {
            tier: 'reference',
            primaryDeadline: null,
            daysRemaining: null,
            isOverdue: false,
        };
    }

    const returnResult = classifyDeadline(
        purchase.returnDeadline,
        URGENCY_THRESHOLDS.RETURN_URGENT_DAYS,
        URGENCY_THRESHOLDS.RETURN_UPCOMING_DAYS
    );

    const warrantyResult = classifyDeadline(
        purchase.warrantyExpiry,
        URGENCY_THRESHOLDS.WARRANTY_URGENT_DAYS,
        URGENCY_THRESHOLDS.WARRANTY_UPCOMING_DAYS
    );

    // Determine which deadline is more urgent
    // Priority order: urgent > upcoming > reference
    // Within same tier, return deadline takes precedence (more time-sensitive)
    const tierPriority: Record<UrgencyTier, number> = {
        urgent: 0,
        upcoming: 1,
        reference: 2,
    };

    let primaryDeadline: 'return' | 'warranty' | null = null;
    let tier: UrgencyTier = 'reference';
    let daysRemaining: number | null = null;

    // Compare return vs warranty urgency
    if (returnResult.days !== null && warrantyResult.days !== null) {
        // Both have deadlines - use most urgent
        if (tierPriority[returnResult.tier] <= tierPriority[warrantyResult.tier]) {
            tier = returnResult.tier;
            primaryDeadline = 'return';
            daysRemaining = returnResult.days;
        } else {
            tier = warrantyResult.tier;
            primaryDeadline = 'warranty';
            daysRemaining = warrantyResult.days;
        }
    } else if (returnResult.days !== null) {
        tier = returnResult.tier;
        primaryDeadline = 'return';
        daysRemaining = returnResult.days;
    } else if (warrantyResult.days !== null) {
        tier = warrantyResult.tier;
        primaryDeadline = 'warranty';
        daysRemaining = warrantyResult.days;
    }

    return {
        tier,
        primaryDeadline,
        daysRemaining,
        isOverdue: daysRemaining !== null && daysRemaining < 0,
    };
}

/**
 * Get urgency tier for a purchase (simplified accessor)
 */
export function getUrgencyTier(purchase: Purchase): UrgencyTier {
    return getUrgencyClassification(purchase).tier;
}

/**
 * Sort purchases by urgency (urgent first, then upcoming, then reference)
 * Within each tier, sort by days remaining (most critical first)
 */
export function sortByUrgency(purchases: Purchase[]): Purchase[] {
    return [...purchases].sort((a, b) => {
        const classA = getUrgencyClassification(a);
        const classB = getUrgencyClassification(b);

        const tierPriority: Record<UrgencyTier, number> = {
            urgent: 0,
            upcoming: 1,
            reference: 2,
        };

        // Sort by tier first
        const tierDiff = tierPriority[classA.tier] - tierPriority[classB.tier];
        if (tierDiff !== 0) {
            return tierDiff;
        }

        // Within same tier, sort by days remaining (null goes last)
        if (classA.daysRemaining === null && classB.daysRemaining === null) {
            return 0;
        }
        if (classA.daysRemaining === null) {
            return 1;
        }
        if (classB.daysRemaining === null) {
            return -1;
        }

        return classA.daysRemaining - classB.daysRemaining;
    });
}

/**
 * Group purchases by urgency tier
 */
export function groupByUrgency(purchases: Purchase[]): {
    urgent: Purchase[];
    upcoming: Purchase[];
    reference: Purchase[];
} {
    const result = {
        urgent: [] as Purchase[],
        upcoming: [] as Purchase[],
        reference: [] as Purchase[],
    };

    for (const purchase of purchases) {
        const tier = getUrgencyTier(purchase);
        result[tier].push(purchase);
    }

    // Sort within each group
    result.urgent = sortByUrgency(result.urgent);
    result.upcoming = sortByUrgency(result.upcoming);
    result.reference = sortByUrgency(result.reference);

    return result;
}

/**
 * Filter to only urgent items
 */
export function filterUrgent(purchases: Purchase[]): Purchase[] {
    return sortByUrgency(purchases.filter((p) => getUrgencyTier(p) === 'urgent'));
}

/**
 * Check if there are any urgent items
 */
export function hasUrgentItems(purchases: Purchase[]): boolean {
    return purchases.some((p) => getUrgencyTier(p) === 'urgent');
}

/**
 * Get count of urgent items
 */
export function countUrgent(purchases: Purchase[]): number {
    return purchases.filter((p) => getUrgencyTier(p) === 'urgent').length;
}
