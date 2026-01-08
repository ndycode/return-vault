/**
 * Chip Primitive
 * Selectable option chip with size variants
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
    /** Size variant */
    size?: 'small' | 'medium';
}

export function Chip({
    label,
    selected = false,
    onPress,
    disabled = false,
    size = 'medium',
}: ChipProps) {
    const isSmall = size === 'small';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.chip,
                isSmall && styles.chipSmall,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
                disabled && styles.chipDisabled,
            ]}
        >
            <Text
                variant={isSmall ? 'meta' : 'label'}
                color={selected ? 'textInverse' : 'textPrimary'}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.lg, // 16px
        paddingVertical: spacing.sm, // 8px
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipSmall: {
        paddingHorizontal: spacing.md, // 12px
        paddingVertical: spacing.xs, // 4px
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
