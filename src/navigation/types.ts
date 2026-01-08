/**
 * Navigation Types & Constants
 * v1.06-E: Navigation Predictability Lock
 * 
 * This file defines the navigation contract for the app.
 * See NAVIGATION_CONTRACT.md for full documentation.
 */

/**
 * Screen roles determine navigation behavior.
 * A screen may NEVER have more than one role.
 */
export type ScreenRole = 'HUB' | 'TASK' | 'DETAIL' | 'SYSTEM';

/**
 * Screen role registry.
 * Every screen in the app must be registered here with exactly one role.
 */
export const SCREEN_ROLES: Record<string, ScreenRole> = {
    // HUB screens: overview, decision making, entry points
    // Back behavior: exit app (Android) / no-op (iOS)
    Home: 'HUB',
    ActionToday: 'HUB',
    
    // TASK screens: focused work, single purpose
    // Back behavior: discard unsaved changes + return
    Add: 'TASK',
    Upgrade: 'TASK',
    
    // DETAIL screens: read/inspect mode
    // Back behavior: return to launching HUB
    ItemDetail: 'DETAIL',
    
    // SYSTEM screens: configuration, infrequent access
    // Back behavior: return to parent screen
    Settings: 'SYSTEM',
} as const;

/**
 * Presentation modes for navigation.
 * Determines how screens are presented (stack push, modal, tab).
 */
export type PresentationMode = 'push' | 'modal' | 'tab';

/**
 * Screen presentation registry.
 */
export const SCREEN_PRESENTATION: Record<string, PresentationMode> = {
    // Tab screens (primary destinations)
    Home: 'tab',
    ActionToday: 'tab',
    Add: 'tab',
    Settings: 'tab',
    
    // Stack screens (drilling into content)
    ItemDetail: 'push',
    Upgrade: 'push',
} as const;

/**
 * Type guard to check if a screen is a HUB.
 */
export function isHubScreen(screenName: string): boolean {
    return SCREEN_ROLES[screenName] === 'HUB';
}

/**
 * Type guard to check if a screen is a TASK.
 */
export function isTaskScreen(screenName: string): boolean {
    return SCREEN_ROLES[screenName] === 'TASK';
}

/**
 * Type guard to check if a screen is a DETAIL.
 */
export function isDetailScreen(screenName: string): boolean {
    return SCREEN_ROLES[screenName] === 'DETAIL';
}

/**
 * Type guard to check if a screen is a SYSTEM screen.
 */
export function isSystemScreen(screenName: string): boolean {
    return SCREEN_ROLES[screenName] === 'SYSTEM';
}

/**
 * Default landing screen for the app.
 * All invalid navigation targets should fall back to this.
 */
export const DEFAULT_LANDING_SCREEN = 'HomeTab' as const;

/**
 * Safe navigation targets.
 * These screens can always be navigated to without params.
 */
export const SAFE_NAVIGATION_TARGETS = [
    'HomeTab',
    'ActionToday',
    'Add',
    'SettingsTab',
] as const;

export type SafeNavigationTarget = typeof SAFE_NAVIGATION_TARGETS[number];
