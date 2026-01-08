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
    /** 10px - buttons, inputs */
    md: 10,
    /** 16px - cards, modals */
    lg: 16,
    /** 9999px - pill/circle */
    full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
