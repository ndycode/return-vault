/**
 * useFormDraft Hook
 * Autosave form drafts to AsyncStorage with navigation guards
 * 
 * v1.06-B: Silent Autosave & State Confidence
 * - Auto-saves form state every 3 seconds
 * - Prevents data loss on navigation away
 * - Restores draft on return
 */

import { useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DRAFT_KEY_PREFIX = 'draft_';
const AUTOSAVE_DELAY_MS = 3000;

export interface DraftConfig<T> {
    /** Unique key for this draft (e.g., 'addItem') */
    draftKey: string;
    /** Current form state */
    state: T;
    /** Function to restore state from draft */
    restoreState: (draft: T) => void;
    /** Check if form has meaningful data worth saving */
    hasData: (state: T) => boolean;
    /** Reset to initial state */
    initialState: T;
}

export function useFormDraft<T>({
    draftKey,
    state,
    restoreState,
    hasData,
    initialState,
}: DraftConfig<T>) {
    const storageKey = `${DRAFT_KEY_PREFIX}${draftKey}`;
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasRestoredRef = useRef(false);
    const navigation = useNavigation();

    /**
     * Save draft to AsyncStorage
     */
    const saveDraft = useCallback(async () => {
        try {
            if (hasData(state)) {
                await AsyncStorage.setItem(storageKey, JSON.stringify(state));
            } else {
                // No meaningful data - clear any existing draft
                await AsyncStorage.removeItem(storageKey);
            }
        } catch (error) {
            // Silent fail - don't interrupt user
            console.warn('Failed to save draft:', error);
        }
    }, [state, storageKey, hasData]);

    /**
     * Load and restore draft on mount
     */
    const loadDraft = useCallback(async () => {
        try {
            const draft = await AsyncStorage.getItem(storageKey);
            if (draft) {
                const parsed = JSON.parse(draft) as T;
                restoreState(parsed);
            }
        } catch (error) {
            // Silent fail - start fresh
            console.warn('Failed to load draft:', error);
        }
    }, [storageKey, restoreState]);

    /**
     * Clear draft (called on successful save)
     */
    const clearDraft = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(storageKey);
        } catch (error) {
            // Silent fail
        }
    }, [storageKey]);

    /**
     * Restore draft on mount (once)
     */
    useEffect(() => {
        if (!hasRestoredRef.current) {
            hasRestoredRef.current = true;
            loadDraft();
        }
    }, [loadDraft]);

    /**
     * Debounced autosave on state changes
     */
    useEffect(() => {
        // Clear previous timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for autosave
        saveTimeoutRef.current = setTimeout(() => {
            saveDraft();
        }, AUTOSAVE_DELAY_MS);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [state, saveDraft]);

    /**
     * Save immediately on navigation blur (leaving screen)
     */
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // Clear timeout and save immediately
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveDraft();
        });

        return unsubscribe;
    }, [navigation, saveDraft]);

    return {
        /** Call on successful form submission to clear draft */
        clearDraft,
        /** Force save now (e.g., before risky operation) */
        saveDraft,
    };
}
