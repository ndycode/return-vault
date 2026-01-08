/**
 * Design System - Shadow Tokens
 * Subtle elevation for depth
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

    /** Subtle card shadow */
    sm: createShadow(1, 2, 0.05, 1),

    /** Standard card shadow */
    md: createShadow(2, 4, 0.08, 3),

    /** Elevated element shadow */
    lg: createShadow(4, 8, 0.1, 6),

    /** Modal/overlay shadow */
    xl: createShadow(8, 16, 0.12, 12),
} as const;

export type ShadowToken = keyof typeof shadows;
