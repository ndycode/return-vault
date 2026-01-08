/**
 * Design System - Border Radius Tokens
 * Refined, enterprise-grade radii
 * 
 * USAGE RULES:
 * - sm: chips, badges, tags, buttons
 * - md: cards, inputs
 * - lg: modals, sheets
 * - full: avatars, circular elements
 */

export const radius = {
    /** 0px - sharp corners */
    none: 0,
    /** 4px - tags, compact badges */
    xs: 4,
    /** 6px - chips, buttons, badges */
    sm: 6,
    /** 10px - cards, inputs */
    md: 10,
    /** 16px - modals, sheets */
    lg: 16,
    /** 9999px - pill/circle */
    full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
