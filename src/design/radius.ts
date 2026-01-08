/**
 * Design System - Border Radius Tokens
 */

export const radius = {
    /** 0px - sharp corners */
    none: 0,
    /** 4px - subtle rounding */
    sm: 4,
    /** 8px - standard rounding */
    md: 8,
    /** 12px - card rounding */
    lg: 12,
    /** 16px - modal rounding */
    xl: 16,
    /** 9999px - pill/circle */
    full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
