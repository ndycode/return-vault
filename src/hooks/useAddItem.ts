/**
 * useAddItem Hook
 * Manages the add purchase flow state and logic
 * 
 * v1.06-B: Zero-Thinking Defaults
 * - Smart store-based defaults
 * - Collapsed optional fields
 * - Reduced cognitive load
 * 
 * v1.06-D: System Confidence Layer
 * - Enterprise-grade error messaging
 * - Silent save confirmation (navigation = success)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createPurchase, createAttachment, updatePurchase, getPurchaseCounts } from '../db';
import { type TabParamList } from '../navigation/TabNavigator';
import { DEFAULT_LANDING_SCREEN } from '../navigation/types';
import { capturePhoto, pickPhoto, saveImageToDocuments } from '../services/attachmentService';
import {
    scheduleNotificationsForPurchase,
    requestNotificationPermission
} from '../services/notificationService';
import { useSettingsStore, canUseProFeature } from '../store/settingsStore';
import { getCurrentDateISO } from '../utils/dateUtils';
import { getStoreDefaults, UNIVERSAL_DEFAULTS, FieldVisibility, getInitialFieldVisibility } from '../utils/defaults';
import { VALIDATION, ERROR, ALERT_TITLES } from '../utils/copy';
import { FREE_ITEM_LIMIT } from '../types/pro';

export interface AddItemState {
    name: string;
    store: string;
    purchaseDate: string;
    returnWindowDays: number | null;
    warrantyMonths: number | null;
    price: string;
    serialNumber: string;
    notes: string;
    photoUri: string | null;
    additionalPhotos: string[];
    isLoading: boolean;
    /** Whether user hit the purchase limit */
    showLimitModal: boolean;
    /** Remaining free purchases for display */
    remainingFree: number;
    /** Whether store defaults were applied (for hint display) */
    storeDefaultsApplied: boolean;
    /** Field visibility for collapsed sections */
    fieldVisibility: FieldVisibility;
}

const initialState: AddItemState = {
    name: '',
    store: '',
    purchaseDate: getCurrentDateISO(),
    returnWindowDays: UNIVERSAL_DEFAULTS.returnWindowDays,
    warrantyMonths: UNIVERSAL_DEFAULTS.warrantyMonths,
    price: '',
    serialNumber: '',
    notes: '',
    photoUri: null,
    additionalPhotos: [],
    isLoading: false,
    showLimitModal: false,
    remainingFree: FREE_ITEM_LIMIT,
    storeDefaultsApplied: false,
    fieldVisibility: getInitialFieldVisibility(),
};

export function useAddItem() {
    const [state, setState] = useState<AddItemState>(initialState);
    const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
    const isPro = useSettingsStore((s) => s.isPro);

    const notificationSettings = useSettingsStore((s) => s.notificationSettings);
    const hasRequestedPermission = useSettingsStore((s) => s.hasRequestedNotificationPermission);
    const setHasRequestedPermission = useSettingsStore((s) => s.setHasRequestedNotificationPermission);

    // Load remaining free purchases on mount
    useEffect(() => {
        const loadRemaining = async () => {
            if (isPro) {
                setState((prev) => ({ ...prev, remainingFree: Infinity }));
                return;
            }
            const counts = await getPurchaseCounts();
            const remaining = Math.max(0, FREE_ITEM_LIMIT - counts.active);
            setState((prev) => ({ ...prev, remainingFree: remaining }));
        };
        loadRemaining();
    }, [isPro]);

    const updateField = useCallback(<K extends keyof AddItemState>(
        field: K,
        value: AddItemState[K]
    ) => {
        setState((prev) => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Handle store field change with smart defaults
     * v1.06-B: Auto-apply store-specific return/warranty policies
     */
    const handleStoreChange = useCallback((storeName: string) => {
        setState((prev) => {
            const storeDefaults = getStoreDefaults(storeName);

            if (storeDefaults) {
                // Apply store-specific defaults
                return {
                    ...prev,
                    store: storeName,
                    returnWindowDays: storeDefaults.returnDays,
                    warrantyMonths: storeDefaults.warrantyMonths,
                    storeDefaultsApplied: true,
                };
            }

            // No matching store - just update the field
            return {
                ...prev,
                store: storeName,
                storeDefaultsApplied: false,
            };
        });
    }, []);

    /**
     * Toggle visibility of optional fields section
     * v1.06-B: Collapsed by default to reduce cognitive load
     */
    const toggleMoreDetails = useCallback(() => {
        setState((prev) => ({
            ...prev,
            fieldVisibility: {
                ...prev.fieldVisibility,
                showMoreDetails: !prev.fieldVisibility.showMoreDetails,
            },
        }));
    }, []);

    const handleCapturePhoto = useCallback(async () => {
        const uri = await capturePhoto();
        if (uri) {
            updateField('photoUri', uri);
        }
    }, [updateField]);

    const handlePickPhoto = useCallback(async () => {
        const uri = await pickPhoto();
        if (uri) {
            updateField('photoUri', uri);
        }
    }, [updateField]);

    const handleAddAdditionalPhoto = useCallback(async (fromCamera: boolean) => {
        const uri = fromCamera ? await capturePhoto() : await pickPhoto();
        if (uri) {
            setState((prev) => ({
                ...prev,
                additionalPhotos: [...prev.additionalPhotos, uri],
            }));
        }
    }, []);

    const handleRemovePhoto = useCallback((index: number) => {
        setState((prev) => ({
            ...prev,
            additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
        }));
    }, []);

    const validate = useCallback((): boolean => {
        if (!state.name.trim()) {
            Alert.alert(ALERT_TITLES.INFO, VALIDATION.REQUIRED_NAME);
            return false;
        }
        if (!state.photoUri) {
            Alert.alert(ALERT_TITLES.INFO, VALIDATION.REQUIRED_PHOTO);
            return false;
        }
        return true;
    }, [state.name, state.photoUri]);

    const handleSave = useCallback(async () => {
        if (!validate()) return;

        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            // Check purchase limit before saving (for free users)
            const counts = await getPurchaseCounts();
            const canAdd = canUseProFeature('UNLIMITED_ITEMS', isPro, counts.active);

            if (!canAdd) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    showLimitModal: true,
                }));
                return;
            }

            // Request notification permission if not already requested
            if (!hasRequestedPermission) {
                await requestNotificationPermission();
                setHasRequestedPermission(true);
            }

            // Parse price if provided
            const parsedPrice = state.price ? parseFloat(state.price) : undefined;

            // Create purchase record
            const purchase = await createPurchase({
                name: state.name.trim(),
                store: state.store.trim() || undefined,
                purchaseDate: state.purchaseDate,
                returnWindowDays: state.returnWindowDays ?? undefined,
                warrantyMonths: state.warrantyMonths ?? undefined,
                price: parsedPrice !== undefined && !isNaN(parsedPrice) ? parsedPrice : undefined,
                serialNumber: state.serialNumber.trim() || undefined,
                notes: state.notes.trim() || undefined,
            });

            // Save main receipt photo
            if (state.photoUri) {
                const savedUri = await saveImageToDocuments(state.photoUri);
                await createAttachment({
                    purchaseId: purchase.id,
                    type: 'receipt',
                    uri: savedUri,
                });
            }

            // Save additional photos
            for (const photoUri of state.additionalPhotos) {
                const savedUri = await saveImageToDocuments(photoUri);
                await createAttachment({
                    purchaseId: purchase.id,
                    type: 'other',
                    uri: savedUri,
                });
            }

            // Schedule notifications
            const notificationIds = await scheduleNotificationsForPurchase(
                purchase,
                notificationSettings
            );

            // Update purchase with notification IDs
            if (notificationIds.length > 0) {
                await updatePurchase(purchase.id, {
                    notificationIds: JSON.stringify(notificationIds),
                });
            }

            // Reset form and navigate to Home tab (v1.06-E: TASK save → HUB)
            setState(initialState);
            navigation.navigate(DEFAULT_LANDING_SCREEN);
        } catch (error) {
            console.error('Failed to save purchase:', error);
            Alert.alert(ALERT_TITLES.ERROR, ERROR.SAVE_FAILED);
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [state, validate, navigation, notificationSettings, hasRequestedPermission, setHasRequestedPermission, isPro]);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    const dismissLimitModal = useCallback(() => {
        setState((prev) => ({ ...prev, showLimitModal: false }));
    }, []);

    return {
        state,
        updateField,
        handleStoreChange,
        toggleMoreDetails,
        handleCapturePhoto,
        handlePickPhoto,
        handleAddAdditionalPhoto,
        handleRemovePhoto,
        handleSave,
        reset,
        dismissLimitModal,
    };
}
