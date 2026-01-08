/**
 * DeadlineTag Component
 * Shows deadline status with color coding
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';
import { getDeadlineStatus } from '../utils/dateUtils';

interface DeadlineTagProps {
    deadline: string;
    type: 'return' | 'warranty';
}

export function DeadlineTag({ deadline, type }: DeadlineTagProps) {
    const status = getDeadlineStatus(deadline);

    const getBackgroundColor = () => {
        switch (status.type) {
            case 'overdue':
                return colors.error50;
            case 'today':
                return colors.warning50;
            case 'soon':
                return colors.warning50;
            default:
                return colors.gray100;
        }
    };

    const getTextColor = (): 'error600' | 'warning600' | 'textSecondary' => {
        switch (status.type) {
            case 'overdue':
                return 'error600';
            case 'today':
            case 'soon':
                return 'warning600';
            default:
                return 'textSecondary';
        }
    };

    const prefix = type === 'return' ? 'Return: ' : 'Warranty: ';

    return (
        <View style={[styles.tag, { backgroundColor: getBackgroundColor() }]}>
            <Text variant="caption" color={getTextColor()}>
                {prefix}{status.text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        alignSelf: 'flex-start',
    },
});
