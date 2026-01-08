/**
 * MetaText Primitive
 * Dates, counts, labels, and other metadata
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

export interface MetaTextProps extends ViewProps {
    /** Label text */
    label: string;
    /** Value text */
    value: string;
    /** Layout direction */
    layout?: 'horizontal' | 'vertical';
}

export function MetaText({
    label,
    value,
    layout = 'vertical',
    style,
    ...props
}: MetaTextProps) {
    return (
        <View
            style={[
                styles.container,
                layout === 'horizontal' && styles.horizontal,
                style,
            ]}
            {...props}
        >
            <Text variant="meta" color="textSecondary">
                {label}
            </Text>
            <Text
                variant={layout === 'horizontal' ? 'body' : 'secondary'}
                color="textPrimary"
                style={layout === 'vertical' && styles.verticalValue}
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    verticalValue: {
        marginTop: spacing.xs,
    },
});
