/**
 * Navigation Barrel Export
 */

export { TabNavigator, type TabParamList } from './TabNavigator';
export { HomeStack, type HomeStackParamList } from './HomeStack';
export { SettingsStack, type SettingsStackParamList } from './SettingsStack';

// v1.06-E: Navigation Contract Types
export {
    type ScreenRole,
    type PresentationMode,
    type SafeNavigationTarget,
    SCREEN_ROLES,
    SCREEN_PRESENTATION,
    DEFAULT_LANDING_SCREEN,
    SAFE_NAVIGATION_TARGETS,
    isHubScreen,
    isTaskScreen,
    isDetailScreen,
    isSystemScreen,
} from './types';
