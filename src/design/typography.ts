/**
 * Design System - Typography Tokens
 * Enterprise/fintech-grade font scale with clear hierarchy.
 * 
 * HIERARCHY (top to bottom):
 * - display: Hero numbers, pricing (36px)
 * - screenTitle: Page headers (28px)
 * - title: Card titles, modal headers (20px) 
 * - sectionHeader: Section dividers (13px uppercase)
 * - body: Primary content (16px)
 * - label: Form labels, dense UI (14px medium)
 * - secondary: Supporting text (14px regular)
 * - meta: Timestamps, footnotes (12px)
 * 
 * WEIGHT TIERS:
 * - 700: Titles (screenTitle)
 * - 600: Emphasis (title, sectionHeader, button)
 * - 500: Labels (label)
 * - 400: Body copy (body, secondary, meta)
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const typography = {
    /**
     * DISPLAY - Hero numbers, pricing, stats
     * 36/44 ExtraBold - commanding, rare usage
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
     * 28/36 Bold - authoritative but not aggressive
     */
    screenTitle: {
        fontFamily,
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: -0.5,
    } as TextStyle,

    /**
     * TITLE - Card titles, modal headers, item names
     * 20/28 SemiBold - mid-hierarchy anchor
     */
    title: {
        fontFamily,
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        letterSpacing: -0.3,
    } as TextStyle,

    /**
     * SECTION HEADER - Section dividers, grouped content labels
     * 13/18 SemiBold uppercase - classic finance/enterprise pattern
     */
    sectionHeader: {
        fontFamily,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        letterSpacing: 0.8,
    } as TextStyle,

    /**
     * BODY - Primary reading content
     * 16/24 Regular - iOS standard, refined
     */
    body: {
        fontFamily,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: -0.1,
    } as TextStyle,

    /**
     * LABEL - Form labels, table headers, compact items
     * 14/20 Medium - slightly emphasized
     */
    label: {
        fontFamily,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * SECONDARY - Supporting text, descriptions
     * 14/20 Regular - same size as label but less weight
     */
    secondary: {
        fontFamily,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * META - Timestamps, badges, footnotes
     * 12/16 Regular - clearly subordinate
     */
    meta: {
        fontFamily,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.1,
    } as TextStyle,

    /**
     * BUTTON - Primary actions
     * 16/24 SemiBold - matches body size with emphasis
     */
    button: {
        fontFamily,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0,
    } as TextStyle,

    /**
     * BUTTON SMALL - Compact actions
     * 14/20 SemiBold
     */
    buttonSmall: {
        fontFamily,
        fontSize: 14,
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
