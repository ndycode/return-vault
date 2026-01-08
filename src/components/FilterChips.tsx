/**
 * FilterChips Component
 * Status filter chips for purchases list
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from './primitives';
import { PurchaseStatus } from '../types';
import { spacing } from '../design';

type FilterValue = PurchaseStatus | 'all';

interface FilterChipsProps {
    value: FilterValue;
    onChange: (value: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Archived', value: 'archived' },
];

export function FilterChips({ value, onChange }: FilterChipsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter) => (
                <Chip
                    key={filter.value}
                    label={filter.label}
                    selected={value === filter.value}
                    onPress={() => onChange(filter.value)}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
        paddingRight: spacing.lg,
    },
});
