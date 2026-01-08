/**
 * Design System - Typography Tokens
 * Enterprise-grade font scale with clear hierarchy and functional roles.
 * 
 * USAGE RULES:
 * - screenTitle: Main screen headers (H1)
 * - sectionHeader: Section dividers, card titles (H2/H3)
 * - label: Form labels, table headers, dense UI
 * - body: Primary content
 * - secondary: Supporting text, descriptions
 * - meta: Timestamp, small metadata, footnotes
 * - display: Large pricing or stats
 * - symbol*: Iconography using text characters
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const typography = {
    /**
     * DISPLAY - Large pricing, stats, hero numbers
     * 36/44 ExtraBold
     */
    display: {
        fontFamily,
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 44,
        letterSpacing: -0.5,
    } as TextStyle,

    /**
     * SCREEN TITLE - Page headers
     * 28/34 Bold
     */
    screenTitle: {
        fontFamily,
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
        letterSpacing: -0.4,
    } as TextStyle,

    /**
     * SECTION HEADER - Card titles, modal headers, section dividers
     * 20/28 SemiBold
     */
    sectionHeader: {
        fontFamily,
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        letterSpacing: -0.2,
    } as TextStyle,

    /**
     * LABEL - Input labels, table headers, compact items
     * 15/20 SemiBold
     */
    label: {
        fontFamily,
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * BODY - Primary reading content
     * 17/24 Regular
     */
    body: {
        fontFamily,
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * SECONDARY - Supporting text, list items
     * 15/20 Regular
     */
    secondary: {
        fontFamily,
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * META - Timestamps, badges, footnotes
     * 13/16 Regular
     */
    meta: {
        fontFamily,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * BUTTON - Primary actions
     * 17/24 SemiBold
     */
    button: {
        fontFamily,
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * BUTTON SMALL - Compact actions
     * 15/20 SemiBold
     */
    buttonSmall: {
        fontFamily,
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0,
    } as TextStyle,

    // SYMBOLS (Iconography via Text)
    
    /** 40px Symbol */
    symbolXL: {
        fontFamily,
        fontSize: 40,
        fontWeight: '400',
        lineHeight: 48,
    } as TextStyle,

    /** 16px Symbol */
    symbolMd: {
        fontFamily,
        fontSize: 16,
        fontWeight: '700', // Bold for checkmarks
        lineHeight: 20,
    } as TextStyle,

    /** 10px Symbol */
    symbolXS: {
        fontFamily,
        fontSize: 10,
        fontWeight: '400',
        lineHeight: 12,
    } as TextStyle,

} as const;

export type TypographyToken = keyof typeof typography;
