/**
 * usePurchases Hook
 * Manages purchases list state and queries
 */

import { useState, useEffect, useCallback } from 'react';
import { Purchase, PurchaseStatus } from '../types';
import { getPurchases, searchPurchases, getUniqueStores } from '../db';

interface UsePurchasesOptions {
    status?: PurchaseStatus;
    store?: string;
}

export function usePurchases(options?: UsePurchasesOptions) {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPurchases = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPurchases({
                status: options?.status,
                store: options?.store,
                orderBy: 'returnDeadline',
                orderDirection: 'ASC',
            });
            setPurchases(data);
        } catch (err) {
            console.error('Failed to load purchases:', err);
            setError('Failed to load purchases');
        } finally {
            setIsLoading(false);
        }
    }, [options?.status, options?.store]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);

    return {
        purchases,
        isLoading,
        error,
        refresh: loadPurchases,
    };
}

export function useSearchPurchases() {
    const [results, setResults] = useState<Purchase[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const data = await searchPurchases(query);
            setResults(data);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clear = useCallback(() => {
        setResults([]);
    }, []);

    return {
        results,
        isSearching,
        search,
        clear,
    };
}

export function useStores() {
    const [stores, setStores] = useState<string[]>([]);

    useEffect(() => {
        const loadStores = async () => {
            try {
                const data = await getUniqueStores();
                setStores(data);
            } catch (err) {
                console.error('Failed to load stores:', err);
            }
        };

        loadStores();
    }, []);

    return stores;
}
