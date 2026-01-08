/**
 * useActionItems Hook
 * Manages action items for deadlines
 */

import { useState, useEffect, useCallback } from 'react';
import { Purchase } from '../types';
import { getActionItems } from '../db';

interface ActionItems {
    returnDueSoon: Purchase[];
    warrantyExpiringSoon: Purchase[];
    overdue: Purchase[];
}

export function useActionItems() {
    const [items, setItems] = useState<ActionItems>({
        returnDueSoon: [],
        warrantyExpiringSoon: [],
        overdue: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadItems = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getActionItems();
            setItems(data);
        } catch (err) {
            console.error('Failed to load action items:', err);
            setError('Failed to load action items');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const totalCount = items.returnDueSoon.length +
        items.warrantyExpiringSoon.length +
        items.overdue.length;

    return {
        ...items,
        totalCount,
        isLoading,
        error,
        refresh: loadItems,
    };
}
