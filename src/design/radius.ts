/**
 * Design System - Border Radius Tokens
 * 
 * USAGE RULES:
 * - sm: chips, badges, tags
 * - md: buttons, inputs, small cards
 * - lg: cards, modals
 * - full: avatars, circular elements
 */

export const radius = {
    /** 0px - sharp corners */
    none: 0,
    /** 6px - chips, badges */
    sm: 6,
    /** 8px - buttons, inputs */
    md: 8,
    /** 12px - cards, modals */
    lg: 12,
    /** 9999px - pill/circle */
    full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
