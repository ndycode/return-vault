/**
 * Input Primitive
 * Text input with label support
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    StyleSheet,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../design';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
    /** Input label */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helper?: string;
}

export function Input({
    label,
    error,
    helper,
    style,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && (
                <Text variant="label" color="textSecondary" style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={colors.textTertiary}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                {...props}
            />
            {error && (
                <Text variant="meta" color="error500" style={styles.helper}>
                    {error}
                </Text>
            )}
            {!error && helper && (
                <Text variant="meta" color="textTertiary" style={styles.helper}>
                    {helper}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        color: colors.textPrimary,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm, // 6px
        paddingHorizontal: spacing.lg, // 16px
        paddingVertical: spacing.md, // 12px
        minHeight: 48,
    },
    inputFocused: {
        borderColor: colors.primary500,
        backgroundColor: colors.background,
    },
    inputError: {
        borderColor: colors.error500,
    },
    helper: {
        marginTop: spacing.xs,
    },
});
