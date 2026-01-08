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
            <Text variant="h3" center style={styles.title}>
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
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxxl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: radius.full,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    icon: {
        width: 40,
        height: 40,
        backgroundColor: colors.gray300,
        borderRadius: 8,
    },
    title: {
        marginBottom: spacing.sm,
    },
    message: {
        marginBottom: spacing.lg,
    },
});
