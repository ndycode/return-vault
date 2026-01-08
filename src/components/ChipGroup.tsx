/**
 * ChipGroup Component
 * Group of selectable chips with single selection
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
}

export function ChipGroup<T>({
    options,
    value,
    onChange,
    allowDeselect = true,
}: ChipGroupProps<T>) {
    const handlePress = (optionValue: T) => {
        if (value === optionValue && allowDeselect) {
            onChange(null);
        } else {
            onChange(optionValue);
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {options.map((option, index) => (
                <View key={index} style={styles.chip}>
                    <Chip
                        label={option.label}
                        selected={value === option.value}
                        onPress={() => handlePress(option.value)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    chip: {
        marginRight: spacing.xs,
    },
});
