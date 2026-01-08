/**
 * Design System - Spacing Tokens
 * Consistent spacing scale (4px base unit)
 */

export const spacing = {
    /** 4px */
    xs: 4,
    /** 8px */
    sm: 8,
    /** 12px */
    md: 12,
    /** 16px */
    lg: 16,
    /** 24px */
    xl: 24,
    /** 32px */
    xxl: 32,
    /** 48px */
    xxxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;
