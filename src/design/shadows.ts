/**
 * Design System - Shadow Tokens
 * Subtle elevation for depth (enterprise-grade: visible but restrained)
 * 
 * USAGE RULES:
 * - none: flat elements, inset content
 * - sm: cards, list items (primary use)
 * - md: elevated cards, dropdowns, floating elements
 * - lg: modals, overlays only
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
    ViewStyle,
    'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
    offsetY: number,
    blur: number,
    opacity: number,
    elevation: number
): ShadowStyle => ({
    shadowColor: '#0F172A', // gray900 for cooler shadow
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
    /** No shadow */
    none: createShadow(0, 0, 0, 0),

    /** Card shadow - subtle but visible */
    sm: createShadow(1, 3, 0.08, 2),

    /** Elevated elements - dropdowns, popovers */
    md: createShadow(4, 12, 0.12, 4),

    /** Modal/overlay shadow */
    lg: createShadow(8, 24, 0.16, 8),
} as const;

export type ShadowToken = keyof typeof shadows;
