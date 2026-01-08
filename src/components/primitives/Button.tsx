/**
 * Button Primitive
 * Primary and secondary button variants
 * 
 * HIERARCHY:
 * - primary: Main CTA, one per screen ideally
 * - secondary: Alternative actions
 * - ghost: Tertiary, cancel, dismiss
 */

import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { colors, spacing, radius, typography, shadows } from '../../design';
import { Text } from './Text';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
    /** Button label */
    title: string;
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'ghost';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Loading state */
    loading?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Accessibility label (defaults to title) */
    accessibilityLabel?: string;
    /** Accessibility hint for additional context */
    accessibilityHint?: string;
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    accessibilityLabel,
    accessibilityHint,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.base,
                styles[variant],
                styles[`size_${size}`],
                fullWidth && styles.fullWidth,
                pressed && styles[`${variant}Pressed`],
                isDisabled && styles.disabled,
            ]}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? colors.textInverse : colors.primary600}
                />
            ) : (
                <Text
                    variant={size === 'sm' ? 'buttonSmall' : 'button'}
                    color={variant === 'primary' ? 'textInverse' : 'primary600'}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.sm, // 6px - more refined
    },
    fullWidth: {
        width: '100%',
    },

    // Variants
    primary: {
        backgroundColor: colors.primary600,
        ...shadows.sm, // Subtle grounding shadow
    },
    primaryPressed: {
        backgroundColor: colors.primary700,
    },
    secondary: {
        backgroundColor: colors.primary50,
    },
    secondaryPressed: {
        backgroundColor: colors.primary100,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    ghostPressed: {
        backgroundColor: colors.gray100,
    },

    // Sizes (8pt grid, 44pt minimum touch target)
    size_sm: {
        paddingHorizontal: spacing.lg, // 16px
        paddingVertical: spacing.sm, // 8px
        minHeight: 44,
    },
    size_md: {
        paddingHorizontal: spacing.xl, // 24px
        paddingVertical: spacing.md, // 12px
        minHeight: 48,
    },
    size_lg: {
        paddingHorizontal: spacing.xxl, // 32px
        paddingVertical: spacing.lg, // 16px
        minHeight: 56,
    },

    disabled: {
        opacity: 0.5,
    },
});
