/**
 * Card Primitive
 * Elevated surface container - primary content grouping
 * 
 * VISUAL HIERARCHY:
 * - No visible border (shadow provides separation)
 * - Subtle shadow for depth
 * - White background against gray100 surface
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
    /** Accessibility label for pressable cards */
    accessibilityLabel?: string;
    /** Accessibility hint for additional context */
    accessibilityHint?: string;
}

export function Card({
    onPress,
    padding = 'md',
    style,
    children,
    accessibilityLabel,
    accessibilityHint,
    ...props
}: CardProps) {
    const getPadding = () => {
        switch (padding) {
            case 'none': return 0;
            case 'sm': return spacing.sm;
            case 'md': return spacing.lg; // 16px - standard card padding
            case 'lg': return spacing.xl; // 24px - generous padding
        }
    };

    const content = (
        <View
            style={[
                styles.container,
                { padding: getPadding() },
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
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
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
        borderRadius: radius.md, // 10px - refined, not too round
        ...shadows.sm,
    },
    pressed: {
        opacity: 0.95,
    },
});
