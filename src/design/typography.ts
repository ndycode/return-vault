/**
 * Design System - Typography Tokens
 * Matches iOS native tab bar font (SF Pro) for consistency.
 * 
 * HIERARCHY (top to bottom):
 * - display: Hero numbers, pricing (34px)
 * - screenTitle: Page headers (28px)
 * - title: Card titles, modal headers (20px) 
 * - sectionHeader: Section dividers (13px uppercase)
 * - body: Primary content (17px - iOS standard)
 * - label: Form labels, dense UI (15px medium)
 * - secondary: Supporting text (15px regular)
 * - meta: Timestamps, footnotes (13px)
 * - tabLabel: Tab bar labels (10px)
 * 
 * Uses SF Pro (System font) on iOS for native consistency
 */

import { TextStyle, Platform } from 'react-native';

// SF Pro on iOS, Roboto on Android - matches native tab bar
const fontFamily = Platform.select({
    ios: undefined, // undefined uses SF Pro (system default)
    android: 'Roboto',
    default: undefined,
});

export const typography = {
    /**
     * DISPLAY - Hero numbers, pricing, stats
     * 34/41 Bold - iOS Large Title style
     */
    display: {
        fontFamily,
        fontSize: 34,
        fontWeight: '700',
        lineHeight: 41,
        letterSpacing: 0.37,
    } as TextStyle,

    /**
     * SCREEN TITLE - Page headers
     * 28/34 Bold - iOS Title 1
     */
    screenTitle: {
        fontFamily,
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
        letterSpacing: 0.36,
    } as TextStyle,

    /**
     * TITLE - Card titles, modal headers, item names
     * 20/25 SemiBold - iOS Title 3
     */
    title: {
        fontFamily,
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 25,
        letterSpacing: 0.38,
    } as TextStyle,

    /**
     * SECTION HEADER - Section dividers, grouped content labels
     * 13/18 SemiBold uppercase - iOS Footnote emphasized
     */
    sectionHeader: {
        fontFamily,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        letterSpacing: -0.08,
        textTransform: 'uppercase',
    } as TextStyle,

    /**
     * BODY - Primary reading content
     * 17/22 Regular - iOS Body (standard)
     */
    body: {
        fontFamily,
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 22,
        letterSpacing: -0.41,
    } as TextStyle,

    /**
     * LABEL - Form labels, table headers, compact items
     * 15/20 Medium - iOS Subheadline
     */
    label: {
        fontFamily,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: -0.24,
    } as TextStyle,

    /**
     * SECONDARY - Supporting text, descriptions
     * 15/20 Regular - iOS Subheadline regular
     */
    secondary: {
        fontFamily,
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: -0.24,
    } as TextStyle,

    /**
     * META - Timestamps, badges, footnotes
     * 13/18 Regular - iOS Footnote
     */
    meta: {
        fontFamily,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: -0.08,
    } as TextStyle,

    /**
     * BUTTON - Primary actions
     * 17/22 SemiBold - matches body size with emphasis
     */
    button: {
        fontFamily,
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: -0.41,
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
        letterSpacing: -0.24,
    } as TextStyle,

    /**
     * TAB LABEL - Native tab bar style
     * 10/12 Medium - matches iOS tab bar exactly
     */
    tabLabel: {
        fontFamily,
        fontSize: 10,
        fontWeight: '500',
        lineHeight: 12,
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
        fontWeight: '700',
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
