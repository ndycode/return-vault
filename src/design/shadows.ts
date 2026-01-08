/**
 * Design System - Shadow Tokens
 * Subtle elevation for depth (enterprise-grade: minimal shadows)
 * 
 * USAGE RULES:
 * - none: flat elements
 * - sm: cards, list items (primary use)
 * - md: elevated cards, dropdowns
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
    /** No shadow */
    none: createShadow(0, 0, 0, 0),

    /** Subtle card shadow - barely visible */
    sm: createShadow(2, 4, 0.04, 1),

    /** Standard elevation */
    md: createShadow(4, 12, 0.08, 2),

    /** Modal/overlay shadow */
    lg: createShadow(4, 12, 0.08, 4),
} as const;

export type ShadowToken = keyof typeof shadows;
