/**
 * Design System - Visual Priority Tokens
 * Urgency-based visual weight rules
 *
 * VISUAL HIERARCHY RULESET:
 * -------------------------
 * These tokens define how urgency tiers appear across the app.
 * Consistent application ensures users always know "what needs attention now."
 *
 * TIER DEFINITIONS:
 * - URGENT: Full visual weight. Demands attention.
 * - UPCOMING: Reduced weight. Awareness without urgency.
 * - REFERENCE: De-emphasized. Historical/future, can be ignored.
 */

import { colors } from './colors';

/**
 * Opacity values for each urgency tier
 */
export const urgencyOpacity = {
    /** Full opacity - urgent items demand attention */
    urgent: 1.0,
    /** Slightly reduced - upcoming items are visible but calmer */
    upcoming: 0.85,
    /** De-emphasized - reference items fade into background */
    reference: 0.6,
} as const;

/**
 * Border accent colors for urgency indication
 * Used for left-border accents on cards
 */
export const urgencyAccent = {
    urgent: colors.error500,
    upcoming: colors.warning500,
    reference: colors.gray300,
} as const;

/**
 * Background tints for urgency-aware containers
 */
export const urgencyBackground = {
    urgentBanner: colors.error500,
    urgentSubtle: colors.error50,
    upcomingSubtle: colors.warning50,
    referenceSubtle: colors.gray50,
} as const;

/**
 * Section header indicator colors
 */
export const sectionIndicator = {
    urgent: colors.error500,
    upcoming: colors.warning500,
    reference: colors.gray400,
} as const;

/**
 * Visual priority rules (conceptual documentation)
 *
 * SPACING:
 * - Urgent items: Standard spacing (items "breathe")
 * - Upcoming items: Standard spacing
 * - Reference items: Tighter spacing (less prominent)
 *
 * TYPOGRAPHY WEIGHT:
 * - Urgent item title: h3 (semibold), full opacity
 * - Upcoming item title: h3 (semibold), 0.85 opacity
 * - Reference item title: h3 (semibold), textSecondary color
 *
 * COLOR INTENSITY:
 * - Urgent: Red accents (error500), strong contrast
 * - Upcoming: Yellow accents (warning500), moderate contrast
 * - Reference: Gray accents (gray400), low contrast
 *
 * VISUAL CUES:
 * - Urgent cards: Left border accent (error500)
 * - Upcoming cards: No border accent
 * - Reference cards: Reduced container opacity (0.75)
 *
 * DEADLINE TAGS:
 * - Overdue: error50 background, error600 text
 * - Today/Soon: warning50 background, warning600 text
 * - Normal: gray100 background, textSecondary text
 */

export type UrgencyVisualToken = keyof typeof urgencyOpacity;
