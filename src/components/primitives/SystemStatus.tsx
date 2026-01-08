/**
 * SystemStatus Primitive
 * Passive reassurance indicator for system state
 * 
 * v1.06-D: System Confidence Layer
 * - Subtle, non-blocking
 * - Fades naturally into UI
 * - Used for "Saved locally", "Reminders set", etc.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

export interface SystemStatusProps {
    /** Status message (keep short) */
    message: string;
    /** Visual variant */
    variant?: 'default' | 'success' | 'warning';
    /** Show checkmark indicator */
    showCheck?: boolean;
}

export function SystemStatus({
    message,
    variant = 'default',
    showCheck = false,
}: SystemStatusProps) {
    const getIndicatorColor = () => {
        switch (variant) {
            case 'success':
                return colors.success500;
            case 'warning':
                return colors.warning500;
            default:
                return colors.gray400;
        }
    };

    return (
        <View style={styles.container}>
            {showCheck && (
                <View style={[styles.indicator, { backgroundColor: getIndicatorColor() }]}>
                    <Text variant="symbolXS" color="textInverse" style={styles.checkmark}>
                        ✓
                    </Text>
                </View>
            )}
            <Text variant="meta" color="textTertiary" style={styles.message}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.xs,
    },
    checkmark: {
        // fontSize removed (handled by symbolXS)
        lineHeight: 14,
    },
    message: {
        opacity: 0.8,
    },
});
