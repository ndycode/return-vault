/**
 * Notification Service
 * Handles scheduling and canceling local notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Purchase } from '../types';
import { parseISO, addDays } from 'date-fns';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationSettings {
    returnLeadDays: number[];
    warrantyLeadDays: number[];
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
}

export const defaultNotificationSettings: NotificationSettings = {
    returnLeadDays: [1, 3, 7],
    warrantyLeadDays: [7, 14, 30],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
};

/**
 * Request notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
        return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

/**
 * Check if notifications are permitted
 */
export async function checkNotificationPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
}

/**
 * Schedule a notification
 */
async function scheduleNotification(
    title: string,
    body: string,
    triggerDate: Date,
    identifier: string
): Promise<string | null> {
    // Don't schedule if in the past
    if (triggerDate <= new Date()) {
        return null;
    }

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
                data: { identifier },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
            identifier,
        });

        return id;
    } catch (err) {
        console.error('Failed to schedule notification:', err);
        return null;
    }
}

/**
 * Cancel a notification by identifier
 */
export async function cancelNotification(identifier: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (err) {
        console.error('Failed to cancel notification:', err);
    }
}

/**
 * Cancel multiple notifications
 */
export async function cancelNotifications(identifiers: string[]): Promise<void> {
    await Promise.all(identifiers.map(cancelNotification));
}

/**
 * Schedule notifications for a purchase
 * Returns array of notification IDs
 */
export async function scheduleNotificationsForPurchase(
    purchase: Purchase,
    settings: NotificationSettings = defaultNotificationSettings
): Promise<string[]> {
    const notificationIds: string[] = [];

    // Schedule return deadline notifications
    if (purchase.returnDeadline) {
        const deadline = parseISO(purchase.returnDeadline);

        for (const leadDays of settings.returnLeadDays) {
            const triggerDate = addDays(deadline, -leadDays);
            triggerDate.setHours(9, 0, 0, 0); // 9 AM

            const identifier = `return-${purchase.id}-${leadDays}d`;
            const title = 'Return deadline approaching';
            const body = leadDays === 0
                ? `${purchase.name} must be returned today`
                : `${purchase.name} return window ends in ${leadDays} day${leadDays !== 1 ? 's' : ''}`;

            const id = await scheduleNotification(title, body, triggerDate, identifier);
            if (id) {
                notificationIds.push(id);
            }
        }

        // Also schedule day-of notification
        const dayOfDate = new Date(deadline);
        dayOfDate.setHours(9, 0, 0, 0);
        const dayOfId = await scheduleNotification(
            'Return deadline today',
            `${purchase.name} must be returned today`,
            dayOfDate,
            `return-${purchase.id}-0d`
        );
        if (dayOfId) {
            notificationIds.push(dayOfId);
        }
    }

    // Schedule warranty expiry notifications
    if (purchase.warrantyExpiry) {
        const expiry = parseISO(purchase.warrantyExpiry);

        for (const leadDays of settings.warrantyLeadDays) {
            const triggerDate = addDays(expiry, -leadDays);
            triggerDate.setHours(9, 0, 0, 0); // 9 AM

            const identifier = `warranty-${purchase.id}-${leadDays}d`;
            const title = 'Warranty expiring soon';
            const body = `${purchase.name} warranty expires in ${leadDays} day${leadDays !== 1 ? 's' : ''}`;

            const id = await scheduleNotification(title, body, triggerDate, identifier);
            if (id) {
                notificationIds.push(id);
            }
        }
    }

    return notificationIds;
}

/**
 * Cancel all notifications for a purchase
 */
export async function cancelNotificationsForPurchase(purchase: Purchase): Promise<void> {
    if (purchase.notificationIds) {
        try {
            const ids = JSON.parse(purchase.notificationIds) as string[];
            await cancelNotifications(ids);
        } catch (err) {
            console.error('Failed to parse notification IDs:', err);
        }
    }
}

/**
 * Reschedule notifications for a purchase
 * Cancels existing and schedules new
 */
export async function rescheduleNotificationsForPurchase(
    purchase: Purchase,
    settings: NotificationSettings = defaultNotificationSettings
): Promise<string[]> {
    // Cancel existing
    await cancelNotificationsForPurchase(purchase);

    // Schedule new
    return scheduleNotificationsForPurchase(purchase, settings);
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
