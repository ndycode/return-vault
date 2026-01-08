/**
 * SectionHeader Primitive
 * Consistent section titles across screens
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

export interface SectionHeaderProps extends ViewProps {
    /** Section title (uppercase) */
    title: string;
    /** Optional count badge */
    count?: number;
    /** Accent color for indicator */
    accent?: 'default' | 'error' | 'warning' | 'primary';
}

export function SectionHeader({
    title,
    count,
    accent = 'default',
    style,
    ...props
}: SectionHeaderProps) {
    const getAccentColor = () => {
        switch (accent) {
            case 'error':
                return colors.error500;
            case 'warning':
                return colors.warning500;
            case 'primary':
                return colors.primary500;
            default:
                return colors.gray300;
        }
    };

    return (
        <View style={[styles.container, style]} {...props}>
            {accent !== 'default' && (
                <View style={[styles.indicator, { backgroundColor: getAccentColor() }]} />
            )}
            <Text variant="label" color="textSecondary" style={styles.title}>
                {title.toUpperCase()}
            </Text>
            {count !== undefined && (
                <Text variant="label" color="textTertiary" style={styles.count}>
                    {count}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    indicator: {
        width: 3,
        height: 16,
        borderRadius: 2,
        marginRight: spacing.sm,
    },
    title: {
        letterSpacing: 0.5,
    },
    count: {
        marginLeft: spacing.sm,
    },
});
