/**
 * PickerField Component
 * Row-style native iOS action sheet picker matching Settings screen
 */

import React from 'react';
import { View, StyleSheet, Pressable, Alert, Platform, ActionSheetIOS } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';

interface PickerOption<T> {
    label: string;
    value: T;
}

interface PickerFieldProps<T> {
    label: string;
    title: string;
    subtitle?: string;
    options: PickerOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    /** Show as inline row (Settings style) vs bordered field */
    inline?: boolean;
}

export function PickerField<T>({
    label,
    title,
    subtitle,
    options,
    value,
    onChange,
    inline = false,
}: PickerFieldProps<T>) {
    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption?.label || 'Select...';

    const handlePress = () => {
        if (Platform.OS === 'ios') {
            const optionLabels = [...options.map(opt => opt.label), 'Cancel'];

            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title,
                    message: subtitle,
                    options: optionLabels,
                    cancelButtonIndex: options.length,
                },
                (buttonIndex) => {
                    if (buttonIndex < options.length) {
                        onChange(options[buttonIndex].value);
                    }
                }
            );
        } else {
            Alert.alert(
                title,
                subtitle,
                [
                    ...options.map(opt => ({
                        text: opt.label,
                        onPress: () => onChange(opt.value),
                    })),
                    { text: 'Cancel', style: 'cancel' as const },
                ]
            );
        }
    };

    // Inline row style (like Settings screen)
    if (inline) {
        return (
            <Pressable onPress={handlePress} style={styles.inlineRow}>
                <Text variant="body" color="textPrimary">
                    {label}
                </Text>
                <Text variant="body" color="textSecondary">
                    {displayText}
                </Text>
            </Pressable>
        );
    }

    // Bordered field style
    return (
        <View style={styles.container}>
            <Text variant="label" color="textSecondary" style={styles.label}>
                {label}
            </Text>
            <Pressable onPress={handlePress} style={styles.field}>
                <Text variant="body" color="textPrimary">
                    {displayText}
                </Text>
                <Text variant="meta" color="textTertiary">▼</Text>
            </Pressable>
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
    field: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        minHeight: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        minHeight: 44,
    },
});
