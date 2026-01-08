/**
 * useAsyncData Hook
 * Generic data fetching hook with loading/error states
 */

import { useState, useCallback, useEffect } from 'react';

export interface AsyncDataResult<T> {
    /** The fetched data */
    data: T | null;
    /** Whether data is being loaded */
    isLoading: boolean;
    /** Error message if fetch failed */
    error: string | null;
    /** Refresh the data */
    refresh: () => Promise<void>;
}

/**
 * Generic hook for async data fetching with loading and error states
 * 
 * @param fetchFn - Async function that returns the data
 * @param deps - Dependencies that trigger a refetch when changed
 * @returns AsyncDataResult with data, loading, error, and refresh
 */
export function useAsyncData<T>(
    fetchFn: () => Promise<T>,
    deps: unknown[] = []
): AsyncDataResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            console.error('useAsyncData fetch failed:', err);
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFn, ...deps]);

    useEffect(() => {
        load();
    }, [load]);

    return { data, isLoading, error, refresh: load };
}
