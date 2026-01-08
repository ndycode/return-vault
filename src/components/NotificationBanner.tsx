/**
 * NotificationBanner Component
 * Shows when notification permission is denied
 */

import React from 'react';
import { View, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';

interface NotificationBannerProps {
    onDismiss?: () => void;
}

export function NotificationBanner({ onDismiss }: NotificationBannerProps) {
    const handleOpenSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text variant="bodySmall" color="textInverse">
                    Enable notifications to receive return and warranty reminders.
                </Text>
                <Pressable onPress={handleOpenSettings} style={styles.button}>
                    <Text variant="buttonSmall" color="textInverse">
                        Open Settings
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.warning600,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.md,
        marginHorizontal: -spacing.lg,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        marginLeft: spacing.md,
    },
});
