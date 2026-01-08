/**
 * Alert Utilities
 * Centralized alert helpers for consistent error handling
 */

import { Alert, AlertButton } from 'react-native';
import { ALERT_TITLES } from './copy';

/**
 * Show error alert with consistent styling
 */
export function showError(message: string): void {
    Alert.alert(ALERT_TITLES.ERROR, message);
}

/**
 * Show success/info alert
 */
export function showInfo(title: string, message: string): void {
    Alert.alert(title, message);
}

/**
 * Show confirmation dialog with cancel/confirm buttons
 */
export function showConfirm(
    config: {
        title: string;
        message: string;
        cancelText?: string;
        confirmText: string;
        destructive?: boolean;
    },
    onConfirm: () => void | Promise<void>
): void {
    const buttons: AlertButton[] = [
        { text: config.cancelText ?? 'Cancel', style: 'cancel' },
        {
            text: config.confirmText,
            style: config.destructive ? 'destructive' : 'default',
            onPress: onConfirm,
        },
    ];

    Alert.alert(config.title, config.message, buttons);
}

/**
 * Show confirmation with three options (cancel, secondary, primary)
 */
export function showConfirmWithSecondary(
    config: {
        title: string;
        message: string;
        cancelText?: string;
        secondaryText: string;
        primaryText: string;
        destructive?: boolean;
    },
    onSecondary: () => void | Promise<void>,
    onPrimary: () => void | Promise<void>
): void {
    const buttons: AlertButton[] = [
        { text: config.cancelText ?? 'Cancel', style: 'cancel' },
        { text: config.secondaryText, onPress: onSecondary },
        {
            text: config.primaryText,
            style: config.destructive ? 'destructive' : 'default',
            onPress: onPrimary,
        },
    ];

    Alert.alert(config.title, config.message, buttons);
}
