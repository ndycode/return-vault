/**
 * CalmState Component
 * Displays calm/empty state when no urgent items exist
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from './primitives';
import { spacing } from '../design';

export interface CalmStateProps {
    /** Main title text */
    title: string;
    /** Supporting message */
    message: string;
}

export function CalmState({ title, message }: CalmStateProps) {
    return (
        <Card style={styles.container}>
            <Text variant="sectionHeader" color="textSecondary" style={styles.title}>
                {title}
            </Text>
            <Text variant="secondary" color="textTertiary" style={styles.message}>
                {message}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    title: {
        marginBottom: spacing.xs,
    },
    message: {
        textAlign: 'center',
    },
});
