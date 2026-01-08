/**
 * Button Primitive
 * Primary and secondary button variants
 */

import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../design';
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
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
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
        borderRadius: radius.md,
    },
    fullWidth: {
        width: '100%',
    },

    // Variants
    primary: {
        backgroundColor: colors.primary600,
    },
    primaryPressed: {
        backgroundColor: colors.primary700,
    },
    secondary: {
        backgroundColor: colors.primary50,
        borderWidth: 1,
        borderColor: colors.primary200,
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

    // Sizes
    size_sm: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        minHeight: 36,
    },
    size_md: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: 44,
    },
    size_lg: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        minHeight: 52,
    },

    disabled: {
        opacity: 0.5,
    },
});
