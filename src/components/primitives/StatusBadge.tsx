/**
 * StatusBadge Primitive
 * Deadline/status indicator tags
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing, radius } from '../../design';

export type BadgeVariant = 'neutral' | 'warning' | 'error' | 'success' | 'primary';

export interface StatusBadgeProps {
    /** Badge text */
    label: string;
    /** Visual variant */
    variant?: BadgeVariant;
    /** Compact size */
    compact?: boolean;
}

export function StatusBadge({
    label,
    variant = 'neutral',
    compact = false,
}: StatusBadgeProps) {
    const getColors = () => {
        switch (variant) {
            case 'error':
                return { bg: colors.error50, text: colors.error600 };
            case 'warning':
                return { bg: colors.warning50, text: colors.warning600 };
            case 'success':
                return { bg: colors.success50, text: colors.success600 };
            case 'primary':
                return { bg: colors.primary50, text: colors.primary600 };
            default:
                return { bg: colors.gray100, text: colors.textSecondary };
        }
    };

    const colorScheme = getColors();

    return (
        <View
            style={[
                styles.badge,
                compact && styles.compact,
                { backgroundColor: colorScheme.bg },
            ]}
        >
            <Text
                variant="meta"
                style={{ color: colorScheme.text }}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        alignSelf: 'flex-start',
    },
    compact: {
        paddingHorizontal: spacing.xs + 2,
        paddingVertical: 2,
    },
});
