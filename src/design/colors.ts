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
    // NEUTRAL PALETTE (calm, enterprise)
    // ─────────────────────────────────────
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // ─────────────────────────────────────
    // PRIMARY (muted blue - professional)
    // Use sparingly: buttons, links, active states
    // ─────────────────────────────────────
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary200: '#BFDBFE',
    primary300: '#93C5FD',
    primary400: '#60A5FA',
    primary500: '#3B82F6',
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    primary800: '#1E40AF',
    primary900: '#1E3A8A',

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
    surface: '#F9FAFB',
    surfaceElevated: '#FFFFFF',
    
    // ─────────────────────────────────────
    // SEMANTIC BORDERS
    // ─────────────────────────────────────
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderFocus: '#3B82F6',

    // ─────────────────────────────────────
    // SEMANTIC TEXT
    // ─────────────────────────────────────
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    textLink: '#2563EB',
} as const;

export type ColorToken = keyof typeof colors;
