/**
 * Design System - Typography Tokens
 * System font stack with consistent sizing
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const typography = {
    /** Large title - 28/34 bold */
    h1: {
        fontFamily,
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
        letterSpacing: -0.5,
    } as TextStyle,

    /** Section title - 22/28 semibold */
    h2: {
        fontFamily,
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 28,
        letterSpacing: -0.3,
    } as TextStyle,

    /** Card title - 18/24 semibold */
    h3: {
        fontFamily,
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    } as TextStyle,

    /** Body text - 16/22 regular */
    body: {
        fontFamily,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
    } as TextStyle,

    /** Small body - 14/20 regular */
    bodySmall: {
        fontFamily,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    } as TextStyle,

    /** Caption - 12/16 regular */
    caption: {
        fontFamily,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    } as TextStyle,

    /** Button text - 16/22 semibold */
    button: {
        fontFamily,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    } as TextStyle,

    /** Small button - 14/20 semibold */
    buttonSmall: {
        fontFamily,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
