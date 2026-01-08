/**
 * EmptyState Component
 * Displayed when lists are empty
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from './primitives';
import { colors, spacing, radius } from '../design';

interface EmptyStateProps {
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.icon} />
            </View>
            <Text variant="sectionHeader" center style={styles.title}>
                {title}
            </Text>
            <Text variant="body" color="textSecondary" center style={styles.message}>
                {message}
            </Text>
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    variant="secondary"
                    onPress={onAction}
                    size="sm"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl, // 24px
        paddingVertical: spacing.xxxl, // 48px
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: radius.full,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg, // 16px
    },
    icon: {
        width: 32,
        height: 32,
        backgroundColor: colors.gray200,
        borderRadius: radius.sm,
    },
    title: {
        marginBottom: spacing.sm,
    },
    message: {
        marginBottom: spacing.lg, // 16px
    },
});
