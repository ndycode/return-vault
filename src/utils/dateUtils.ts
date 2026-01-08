/**
 * Date Utilities
 * Deadline computation and formatting helpers
 */

import { addDays, addMonths, differenceInDays, format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

/**
 * Get current date as ISO string (date only, no time)
 */
export function getCurrentDateISO(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get current datetime as ISO string
 */
export function getCurrentDateTimeISO(): string {
    return new Date().toISOString();
}

/**
 * Compute return deadline from purchase date and window days
 */
export function computeReturnDeadline(purchaseDate: string, windowDays: number): string {
    const date = parseISO(purchaseDate);
    const deadline = addDays(date, windowDays);
    return format(deadline, 'yyyy-MM-dd');
}

/**
 * Compute warranty expiry from purchase date and warranty months
 */
export function computeWarrantyExpiry(purchaseDate: string, warrantyMonths: number): string {
    const date = parseISO(purchaseDate);
    const expiry = addMonths(date, warrantyMonths);
    return format(expiry, 'yyyy-MM-dd');
}

/**
 * Get days remaining until a deadline
 * Negative values indicate overdue
 */
export function daysUntil(deadlineDate: string): number {
    const deadline = parseISO(deadlineDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(deadline, today);
}

/**
 * Check if a deadline is overdue (past today)
 */
export function isOverdue(deadlineDate: string): boolean {
    const deadline = parseISO(deadlineDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(deadline, today);
}

/**
 * Check if deadline is today
 */
export function isDeadlineToday(deadlineDate: string): boolean {
    const deadline = parseISO(deadlineDate);
    return isToday(deadline);
}

/**
 * Check if deadline is within X days from now
 */
export function isDueSoon(deadlineDate: string, withinDays: number): boolean {
    const days = daysUntil(deadlineDate);
    return days >= 0 && days <= withinDays;
}

/**
 * Format date for display (e.g., "January 8, 2026")
 */
export function formatDisplayDate(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
}

/**
 * Format date short (e.g., "Jan 8")
 */
export function formatShortDate(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, 'MMM d');
}

/**
 * Get deadline status text
 */
export function getDeadlineStatus(deadlineDate: string): {
    text: string;
    type: 'overdue' | 'today' | 'soon' | 'normal';
} {
    const days = daysUntil(deadlineDate);

    if (days < 0) {
        return {
            text: `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`,
            type: 'overdue',
        };
    }

    if (days === 0) {
        return { text: 'Due today', type: 'today' };
    }

    if (days <= 7) {
        return {
            text: `${days} day${days !== 1 ? 's' : ''} left`,
            type: 'soon',
        };
    }

    return {
        text: `${days} days left`,
        type: 'normal',
    };
}
