/**
 * Settings Store
 * Persistent app settings using Zustand + AsyncStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationSettings, defaultNotificationSettings } from '../services/notificationService';
import { ProFeature, FREE_ITEM_LIMIT } from '../types/pro';

interface SettingsState {
    // Notification settings
    notificationSettings: NotificationSettings;

    // App state
    hasRequestedNotificationPermission: boolean;

    // Pro state
    isPro: boolean;
    iapLastCheckedAt: string | null;

    // Actions
    updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
    setHasRequestedNotificationPermission: (value: boolean) => void;
    setPro: (isPro: boolean) => void;
    resetSettings: () => void;
}

const initialState = {
    notificationSettings: defaultNotificationSettings,
    hasRequestedNotificationPermission: false,
    isPro: false,
    iapLastCheckedAt: null,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...initialState,

            updateNotificationSettings: (settings) =>
                set((state) => ({
                    notificationSettings: {
                        ...state.notificationSettings,
                        ...settings,
                    },
                })),

            setHasRequestedNotificationPermission: (value) =>
                set({ hasRequestedNotificationPermission: value }),

            setPro: (isPro) =>
                set({ 
                    isPro, 
                    iapLastCheckedAt: new Date().toISOString() 
                }),

            resetSettings: () => set(initialState),
        }),
        {
            name: 'warranty-locker-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Selectors
export const selectNotificationSettings = (state: SettingsState) => state.notificationSettings;
export const selectReturnLeadDays = (state: SettingsState) => state.notificationSettings.returnLeadDays;
export const selectWarrantyLeadDays = (state: SettingsState) => state.notificationSettings.warrantyLeadDays;
export const selectIsPro = (state: SettingsState) => state.isPro;

/**
 * Check if user can use a pro feature
 * @param feature The feature to check
 * @param isPro Whether user is pro
 * @param activeItemCount Current active item count (for UNLIMITED_ITEMS)
 * @returns boolean - true if feature is available
 */
export function canUseProFeature(
    feature: ProFeature,
    isPro: boolean,
    activeItemCount?: number
): boolean {
    if (isPro) {
        return true;
    }

    // Free user restrictions
    switch (feature) {
        case 'UNLIMITED_ITEMS':
            // Free users limited to FREE_ITEM_LIMIT active items
            return (activeItemCount ?? 0) < FREE_ITEM_LIMIT;
        case 'EXPORT_PROOF':
        case 'BACKUP':
        case 'ADV_NOTIF':
            // Pro-only features
            return false;
        default:
            return false;
    }
}
