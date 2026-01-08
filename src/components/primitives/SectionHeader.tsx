/**
 * SectionHeader Primitive
 * Consistent section dividers - classic finance/enterprise pattern
 * 
 * VISUAL TREATMENT:
 * - 13px uppercase with positive letter-spacing
 * - Optional left-edge indicator for urgency
 * - Count badge in tertiary weight
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

export interface SectionHeaderProps extends ViewProps {
    /** Section title (will be uppercased) */
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
            <Text variant="sectionHeader" color="textSecondary">
                {title.toUpperCase()}
            </Text>
            {count !== undefined && (
                <Text variant="meta" color="textTertiary" style={styles.count}>
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
        paddingVertical: spacing.md, // 12px
    },
    indicator: {
        width: 3,
        height: 14,
        borderRadius: 1,
        marginRight: spacing.sm,
    },
    count: {
        marginLeft: spacing.sm,
    },
});
