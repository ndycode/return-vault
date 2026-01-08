/**
 * Chip Primitive
 * Selectable option chip for presets
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../design';
import { Text } from './Text';

export interface ChipProps {
    /** Chip label */
    label: string;
    /** Selected state */
    selected?: boolean;
    /** Press handler */
    onPress?: () => void;
    /** Disabled state */
    disabled?: boolean;
}

export function Chip({
    label,
    selected = false,
    onPress,
    disabled = false,
}: ChipProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
                disabled && styles.chipDisabled,
            ]}
        >
            <Text
                variant="bodySmall"
                color={selected ? 'textInverse' : 'textPrimary'}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipSelected: {
        backgroundColor: colors.primary600,
        borderColor: colors.primary600,
    },
    chipPressed: {
        opacity: 0.8,
    },
    chipDisabled: {
        opacity: 0.5,
    },
});
