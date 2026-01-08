/**
 * Card Primitive
 * Elevated surface container
 */

import React from 'react';
import { View, StyleSheet, ViewProps, Pressable } from 'react-native';
import { colors, spacing, radius, shadows } from '../../design';

export interface CardProps extends ViewProps {
    /** Pressable card */
    onPress?: () => void;
    /** Card padding */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Children */
    children: React.ReactNode;
}

export function Card({
    onPress,
    padding = 'md',
    style,
    children,
    ...props
}: CardProps) {
    const paddingValue = padding === 'none' ? 0 : spacing[padding];

    const content = (
        <View
            style={[
                styles.container,
                { padding: paddingValue },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => pressed && styles.pressed}
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    pressed: {
        opacity: 0.9,
    },
});
