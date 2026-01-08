/**
 * Date Utilities Tests
 */

import {
    computeReturnDeadline,
    computeWarrantyExpiry,
    daysUntil,
    isOverdue,
    isDueSoon,
    getDeadlineStatus,
    formatDisplayDate,
} from '../src/utils/dateUtils';

describe('dateUtils', () => {
    describe('computeReturnDeadline', () => {
        it('computes 30-day return deadline correctly', () => {
            const result = computeReturnDeadline('2026-01-08', 30);
            expect(result).toBe('2026-02-07');
        });

        it('computes 14-day return deadline correctly', () => {
            const result = computeReturnDeadline('2026-01-08', 14);
            expect(result).toBe('2026-01-22');
        });

        it('handles month boundary correctly', () => {
            const result = computeReturnDeadline('2026-01-25', 30);
            expect(result).toBe('2026-02-24');
        });

        it('handles year boundary correctly', () => {
            const result = computeReturnDeadline('2025-12-15', 30);
            expect(result).toBe('2026-01-14');
        });
    });

    describe('computeWarrantyExpiry', () => {
        it('computes 12-month warranty correctly', () => {
            const result = computeWarrantyExpiry('2026-01-08', 12);
            expect(result).toBe('2027-01-08');
        });

        it('computes 3-month warranty correctly', () => {
            const result = computeWarrantyExpiry('2026-01-08', 3);
            expect(result).toBe('2026-04-08');
        });

        it('computes 24-month warranty correctly', () => {
            const result = computeWarrantyExpiry('2026-01-08', 24);
            expect(result).toBe('2028-01-08');
        });

        it('handles end-of-month dates correctly', () => {
            const result = computeWarrantyExpiry('2026-01-31', 1);
            // January 31 + 1 month = February 28 (or 29 in leap year)
            expect(result).toBe('2026-02-28');
        });
    });

    describe('daysUntil', () => {
        it('returns positive days for future dates', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);
            const dateStr = futureDate.toISOString().split('T')[0];

            expect(daysUntil(dateStr)).toBe(10);
        });

        it('returns 0 for today', () => {
            const today = new Date().toISOString().split('T')[0];
            expect(daysUntil(today)).toBe(0);
        });

        it('returns negative days for past dates', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 5);
            const dateStr = pastDate.toISOString().split('T')[0];

            expect(daysUntil(dateStr)).toBe(-5);
        });
    });

    describe('isOverdue', () => {
        it('returns true for past dates', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const dateStr = pastDate.toISOString().split('T')[0];

            expect(isOverdue(dateStr)).toBe(true);
        });

        it('returns false for today', () => {
            const today = new Date().toISOString().split('T')[0];
            expect(isOverdue(today)).toBe(false);
        });

        it('returns false for future dates', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateStr = futureDate.toISOString().split('T')[0];

            expect(isOverdue(dateStr)).toBe(false);
        });
    });

    describe('isDueSoon', () => {
        it('returns true for dates within range', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 5);
            const dateStr = futureDate.toISOString().split('T')[0];

            expect(isDueSoon(dateStr, 7)).toBe(true);
        });

        it('returns false for dates outside range', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);
            const dateStr = futureDate.toISOString().split('T')[0];

            expect(isDueSoon(dateStr, 7)).toBe(false);
        });

        it('returns false for overdue dates', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const dateStr = pastDate.toISOString().split('T')[0];

            expect(isDueSoon(dateStr, 7)).toBe(false);
        });
    });

    describe('getDeadlineStatus', () => {
        it('returns overdue status for past dates', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 3);
            const dateStr = pastDate.toISOString().split('T')[0];

            const result = getDeadlineStatus(dateStr);
            expect(result.type).toBe('overdue');
            expect(result.text).toBe('3 days overdue');
        });

        it('returns today status for today', () => {
            const today = new Date().toISOString().split('T')[0];

            const result = getDeadlineStatus(today);
            expect(result.type).toBe('today');
            expect(result.text).toBe('Due today');
        });

        it('returns soon status for dates within 7 days', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 3);
            const dateStr = futureDate.toISOString().split('T')[0];

            const result = getDeadlineStatus(dateStr);
            expect(result.type).toBe('soon');
            expect(result.text).toBe('3 days left');
        });

        it('returns normal status for dates beyond 7 days', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 15);
            const dateStr = futureDate.toISOString().split('T')[0];

            const result = getDeadlineStatus(dateStr);
            expect(result.type).toBe('normal');
            expect(result.text).toBe('15 days left');
        });
    });

    describe('formatDisplayDate', () => {
        it('formats date correctly', () => {
            const result = formatDisplayDate('2026-01-08');
            expect(result).toBe('January 8, 2026');
        });

        it('formats another date correctly', () => {
            const result = formatDisplayDate('2026-12-25');
            expect(result).toBe('December 25, 2026');
        });
    });
});
