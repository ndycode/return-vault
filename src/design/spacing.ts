/**
 * Design System - Spacing Tokens
 * 4pt base grid, luxury-tight rhythm
 * 
 * USAGE RULES:
 * - Screen horizontal padding: xl (24px)
 * - Section vertical gap: xxl (32px)
 * - Card internal padding: lg (16px)
 * - Form field vertical gap: md (12px)
 * - Related element gap: sm (8px)
 * - Micro adjustments: xs (4px) or xxs (2px)
 */

export const spacing = {
    /** 2px - hairline gaps, micro adjustments */
    xxs: 2,
    /** 4px - icon-text gap, tight internal */
    xs: 4,
    /** 8px - component internal padding (tight) */
    sm: 8,
    /** 12px - standard gaps, form fields */
    md: 12,
    /** 16px - card padding, section gaps */
    lg: 16,
    /** 24px - screen horizontal padding */
    xl: 24,
    /** 32px - major section breaks */
    xxl: 32,
    /** 48px - screen bottom padding */
    xxxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;
