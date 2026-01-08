/**
 * useNotificationPermission Hook
 * Manages notification permission state
 */

import { useState, useEffect, useCallback } from 'react';
import {
    requestNotificationPermission,
    checkNotificationPermission
} from '../services/notificationService';
import { useSettingsStore } from '../store/settingsStore';

export function useNotificationPermission() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    const hasRequestedPermission = useSettingsStore(
        (state) => state.hasRequestedNotificationPermission
    );
    const setHasRequestedPermission = useSettingsStore(
        (state) => state.setHasRequestedNotificationPermission
    );

    const checkPermission = useCallback(async () => {
        const granted = await checkNotificationPermission();
        setHasPermission(granted);
        return granted;
    }, []);

    const requestPermission = useCallback(async () => {
        setIsRequesting(true);
        try {
            const granted = await requestNotificationPermission();
            setHasPermission(granted);
            setHasRequestedPermission(true);
            return granted;
        } finally {
            setIsRequesting(false);
        }
    }, [setHasRequestedPermission]);

    useEffect(() => {
        checkPermission();
    }, [checkPermission]);

    const shouldShowBanner = hasPermission === false && hasRequestedPermission;

    return {
        hasPermission,
        isRequesting,
        hasRequestedPermission,
        shouldShowBanner,
        checkPermission,
        requestPermission,
    };
}
