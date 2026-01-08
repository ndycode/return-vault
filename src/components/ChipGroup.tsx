/**
 * ChipGroup Component
 * Compact wrapping chip selector for options
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from './primitives';
import { spacing } from '../design';

interface ChipOption<T> {
    label: string;
    value: T;
}

interface ChipGroupProps<T> {
    options: ChipOption<T>[];
    value: T | null;
    onChange: (value: T | null) => void;
    allowDeselect?: boolean;
    /** Use compact size chips */
    compact?: boolean;
}

export function ChipGroup<T>({
    options,
    value,
    onChange,
    allowDeselect = true,
    compact = false,
}: ChipGroupProps<T>) {
    const handlePress = (optionValue: T) => {
        if (value === optionValue && allowDeselect) {
            onChange(null);
        } else {
            onChange(optionValue);
        }
    };

    return (
        <View style={[styles.container, compact && styles.containerCompact]}>
            {options.map((option, index) => (
                <Chip
                    key={index}
                    label={option.label}
                    selected={value === option.value}
                    onPress={() => handlePress(option.value)}
                    size={compact ? 'small' : 'medium'}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    containerCompact: {
        gap: spacing.xs,
    },
});
