/**
 * Design System - Color Tokens
 * Enterprise-grade, calm aesthetic (iOS/fintech feel)
 * 
 * USAGE RULES:
 * - Use semantic names (textPrimary) not palette names (gray900)
 * - Accents: primary for interactive only, not decoration
 * - Status colors: error/warning/success for actual status only
 * - NO hardcoded hex values in components
 */

export const colors = {
    // ─────────────────────────────────────
    // NEUTRAL PALETTE (Slate - Enterprise/Fintech)
    // ─────────────────────────────────────
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A',

    // ─────────────────────────────────────
    // PRIMARY (Deep Blue - Professional)
    // Use sparingly: buttons, links, active states
    // ─────────────────────────────────────
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary200: '#BFDBFE',
    primary300: '#93C5FD',
    primary400: '#60A5FA',
    primary500: '#2563EB', // Deeper (was 600)
    primary600: '#1D4ED8', // Deeper (was 700)
    primary700: '#1E40AF', // Deeper (was 800)
    primary800: '#1E3A8A', // Deeper (was 900)
    primary900: '#172554', // New deepest

    // ─────────────────────────────────────
    // STATUS COLORS (semantic only)
    // ─────────────────────────────────────
    
    // Success - confirmations, completed states
    success50: '#ECFDF5',
    success100: '#D1FAE5',
    success500: '#10B981',
    success600: '#059669',

    // Warning - approaching deadlines, caution
    warning50: '#FFFBEB',
    warning100: '#FEF3C7',
    warning500: '#F59E0B',
    warning600: '#D97706',

    // Error - overdue, destructive, critical
    error50: '#FEF2F2',
    error100: '#FEE2E2',
    error500: '#EF4444',
    error600: '#DC2626',

    // ─────────────────────────────────────
    // SEMANTIC SURFACES
    // ─────────────────────────────────────
    background: '#FFFFFF',
    surface: '#F8FAFC', // gray50
    surfaceElevated: '#FFFFFF',
    
    // ─────────────────────────────────────
    // SEMANTIC BORDERS
    // ─────────────────────────────────────
    border: '#E2E8F0', // gray200
    borderLight: '#F1F5F9', // gray100
    borderFocus: '#2563EB', // primary500

    // ─────────────────────────────────────
    // SEMANTIC TEXT
    // ─────────────────────────────────────
    textPrimary: '#0F172A', // gray900
    textSecondary: '#64748B', // gray500
    textTertiary: '#94A3B8', // gray400
    textInverse: '#FFFFFF',
    textLink: '#2563EB', // primary500
} as const;

export type ColorToken = keyof typeof colors;
