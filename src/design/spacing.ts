/**
 * Design System - Spacing Tokens
 * 8pt grid system (strict)
 * 
 * USAGE RULES:
 * - All spacing must use these tokens
 * - No inline spacing values
 * - Components use sm/md/lg for internal padding
 * - Screens use lg/xl for section gaps
 */

export const spacing = {
    /** 4px - micro adjustments only */
    xs: 4,
    /** 8px - tight spacing */
    sm: 8,
    /** 16px - standard spacing */
    md: 16,
    /** 24px - section spacing */
    lg: 24,
    /** 32px - large gaps */
    xl: 32,
    /** 48px - screen padding bottom */
    xxl: 48,
    /** 64px - reserved */
    xxxl: 64,
} as const;

export type SpacingToken = keyof typeof spacing;
