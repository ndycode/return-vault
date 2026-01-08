/**
 * useRefreshOnFocus Hook
 * Triggers refresh when screen comes into focus
 */

import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Calls the refresh function whenever the screen comes into focus
 * 
 * @param refresh - Function to call on focus (typically from a data hook)
 */
export function useRefreshOnFocus(refresh: () => void): void {
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );
}
