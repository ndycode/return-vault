/**
 * Pro Store
 * Manages Pro/paid status with persistence
 * v1.1 Monetization
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProState {
    /** Whether user has purchased Pro */
    isPro: boolean;

    /** Product ID of the purchased product */
    purchasedProductId: string | null;

    /** Timestamp of purchase */
    purchaseDate: string | null;

    /** Actions */
    setPro: (isPro: boolean, productId?: string) => void;
    clearPro: () => void;
}

const initialState = {
    isPro: false,
    purchasedProductId: null,
    purchaseDate: null,
};

export const useProStore = create<ProState>()(
    persist(
        (set) => ({
            ...initialState,

            setPro: (isPro: boolean, productId?: string) =>
                set({
                    isPro,
                    purchasedProductId: productId ?? null,
                    purchaseDate: isPro ? new Date().toISOString() : null,
                }),

            clearPro: () => set(initialState),
        }),
        {
            name: 'warranty-locker-pro',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Selectors
export const selectProIsPro = (state: ProState) => state.isPro;
