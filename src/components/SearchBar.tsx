/**
 * SearchBar Component
 * Text search input
 */

import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius, typography } from '../design';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.searchIcon} />
            </View>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                returnKeyType="search"
            />
            {value.length > 0 && onClear && (
                <Pressable onPress={onClear} style={styles.clearButton}>
                    <Text variant="label" color="textSecondary">Clear</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.sm,
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    searchIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.gray400,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary,
        paddingVertical: spacing.sm,
    },
    clearButton: {
        paddingLeft: spacing.sm,
    },
});
