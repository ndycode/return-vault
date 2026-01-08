/**
 * SettingsScreen
 * App preferences and backup options
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Card, Divider, Button } from '../components/primitives';
import { useSettingsStore, canUseProFeature } from '../store/settingsStore';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { colors, spacing } from '../design';
import {
    collectDiagnostics,
    shouldShowDiagnostics,
    DiagnosticsData,
} from '../services/diagnosticsService';
import { shareBackup, importBackup } from '../services/exportService';
import { restorePro } from '../utils/iap';
import { SettingsStackParamList } from '../navigation/SettingsStack';

interface SettingsRowProps {
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    disabled?: boolean;
}

function SettingsRow({ label, value, onPress, rightElement, disabled }: SettingsRowProps) {
    const content = (
        <View style={[styles.row, disabled && styles.rowDisabled]}>
            <Text variant="body" color={disabled ? 'textTertiary' : 'textPrimary'}>{label}</Text>
            <View style={styles.rowRight}>
                {value && (
                    <Text variant="body" color="textSecondary">
                        {value}
                    </Text>
                )}
                {rightElement}
            </View>
        </View>
    );

    if (onPress && !disabled) {
        return <Pressable onPress={onPress}>{content}</Pressable>;
    }

    return content;
}

interface DiagnosticsRowProps {
    label: string;
    value: string;
    status?: 'ok' | 'warn' | 'error';
}

function DiagnosticsRow({ label, value, status }: DiagnosticsRowProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'ok':
                return '#22C55E';
            case 'warn':
                return '#F59E0B';
            case 'error':
                return '#EF4444';
            default:
                return colors.textSecondary;
        }
    };

    return (
        <View style={styles.diagnosticsRow}>
            <Text variant="bodySmall" color="textSecondary">
                {label}
            </Text>
            <Text
                variant="bodySmall"
                style={{ color: getStatusColor() }}
            >
                {value}
            </Text>
        </View>
    );
}

function DiagnosticsSection() {
    const [diagnostics, setDiagnostics] = React.useState<DiagnosticsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
        loadDiagnostics();
    }, []);

    const loadDiagnostics = async () => {
        setLoading(true);
        const data = await collectDiagnostics();
        setDiagnostics(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <Card padding="none">
                <View style={styles.cardContent}>
                    <View style={styles.row}>
                        <Text variant="body" color="textSecondary">
                            Loading diagnostics...
                        </Text>
                    </View>
                </View>
            </Card>
        );
    }

    if (!diagnostics) {
        return null;
    }

    return (
        <Card padding="none">
            <View style={styles.cardContent}>
                <TouchableOpacity
                    onPress={() => setExpanded(!expanded)}
                    activeOpacity={0.7}
                >
                    <View style={styles.row}>
                        <Text variant="body">Diagnostics</Text>
                        <Text variant="body" color="textSecondary">
                            {expanded ? '▼' : '▶'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {expanded && (
                    <>
                        <Divider spacing="none" />

                        {/* Database Section */}
                        <View style={styles.diagnosticsSection}>
                            <Text
                                variant="caption"
                                color="textSecondary"
                                style={styles.diagnosticsHeader}
                            >
                                DATABASE
                            </Text>
                            <DiagnosticsRow
                                label="Schema Version"
                                value={`${diagnostics.database.schemaVersion} / ${diagnostics.database.expectedVersion}`}
                                status={diagnostics.database.isUpToDate ? 'ok' : 'error'}
                            />
                        </View>

                        <Divider spacing="none" />

                        {/* Purchases Section */}
                        <View style={styles.diagnosticsSection}>
                            <Text
                                variant="caption"
                                color="textSecondary"
                                style={styles.diagnosticsHeader}
                            >
                                PURCHASES
                            </Text>
                            <DiagnosticsRow
                                label="Total"
                                value={String(diagnostics.purchases.total)}
                            />
                            <DiagnosticsRow
                                label="Active"
                                value={String(diagnostics.purchases.active)}
                            />
                            <DiagnosticsRow
                                label="Archived"
                                value={String(diagnostics.purchases.archived)}
                            />
                        </View>

                        <Divider spacing="none" />

                        {/* Notifications Section */}
                        <View style={styles.diagnosticsSection}>
                            <Text
                                variant="caption"
                                color="textSecondary"
                                style={styles.diagnosticsHeader}
                            >
                                NOTIFICATIONS
                            </Text>
                            <DiagnosticsRow
                                label="Permission"
                                value={diagnostics.notifications.permissionStatus}
                                status={
                                    diagnostics.notifications.permissionStatus === 'granted'
                                        ? 'ok'
                                        : diagnostics.notifications.permissionStatus === 'denied'
                                            ? 'error'
                                            : undefined
                                }
                            />
                        </View>

                        <Divider spacing="none" />

                        {/* Backup Section */}
                        <View style={styles.diagnosticsSection}>
                            <Text
                                variant="caption"
                                color="textSecondary"
                                style={styles.diagnosticsHeader}
                            >
                                BACKUP
                            </Text>
                            <DiagnosticsRow
                                label="Last Backup"
                                value={diagnostics.backup.lastBackupDate ?? 'Never'}
                                status={diagnostics.backup.lastBackupDate ? 'ok' : 'warn'}
                            />
                        </View>

                        <Divider spacing="none" />

                        {/* Debug Logging Section */}
                        <View style={styles.diagnosticsSection}>
                            <Text
                                variant="caption"
                                color="textSecondary"
                                style={styles.diagnosticsHeader}
                            >
                                DEBUG LOGGING
                            </Text>
                            <DiagnosticsRow
                                label="Enabled"
                                value={diagnostics.debug.enabled ? 'Yes' : 'No'}
                                status={diagnostics.debug.enabled ? 'ok' : undefined}
                            />
                            {Object.entries(diagnostics.debug.categories).map(([cat, enabled]) => (
                                <DiagnosticsRow
                                    key={cat}
                                    label={`  ${cat}`}
                                    value={enabled ? 'ON' : 'OFF'}
                                />
                            ))}
                        </View>

                        <Divider spacing="none" />

                        {/* Refresh Button */}
                        <TouchableOpacity onPress={loadDiagnostics} activeOpacity={0.7}>
                            <View style={[styles.row, styles.refreshRow]}>
                                <Text variant="body" color="primary600">
                                    Refresh Diagnostics
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </Card>
    );
}

export function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
    const { hasPermission, requestPermission } = useNotificationPermission();
    const notificationSettings = useSettingsStore((s) => s.notificationSettings);
    const updateNotificationSettings = useSettingsStore((s) => s.updateNotificationSettings);
    const isPro = useSettingsStore((s) => s.isPro);
    
    const [isRestoring, setIsRestoring] = useState(false);
    const [showProModal, setShowProModal] = useState(false);
    const [proModalMessage, setProModalMessage] = useState('');

    const canBackup = canUseProFeature('BACKUP', isPro);

    const handleUpgradePress = () => {
        navigation.navigate('Upgrade');
    };

    const handleRestorePurchases = async () => {
        setIsRestoring(true);
        try {
            const result = await restorePro();
            if (result.success) {
                if (result.hasPro) {
                    Alert.alert('Restored', 'Your Pro purchase has been restored.');
                } else {
                    Alert.alert('No Purchase Found', 'We couldn\'t find a Pro purchase to restore.');
                }
            } else {
                Alert.alert('Restore Failed', result.error || 'Could not restore purchases.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setIsRestoring(false);
        }
    };

    const handleReturnReminderPress = () => {
        Alert.alert(
            'Return Reminder',
            'Choose when to be reminded before return deadline',
            [
                { text: '1 day before', onPress: () => updateNotificationSettings({ returnLeadDays: [1] }) },
                { text: '3 days before', onPress: () => updateNotificationSettings({ returnLeadDays: [1, 3] }) },
                { text: '7 days before', onPress: () => updateNotificationSettings({ returnLeadDays: [1, 3, 7] }) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleWarrantyReminderPress = () => {
        Alert.alert(
            'Warranty Reminder',
            'Choose when to be reminded before warranty expires',
            [
                { text: '7 days before', onPress: () => updateNotificationSettings({ warrantyLeadDays: [7] }) },
                { text: '14 days before', onPress: () => updateNotificationSettings({ warrantyLeadDays: [7, 14] }) },
                { text: '30 days before', onPress: () => updateNotificationSettings({ warrantyLeadDays: [7, 14, 30] }) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleQuietHoursToggle = (value: boolean) => {
        updateNotificationSettings({ quietHoursEnabled: value });
    };

    const handleExport = async () => {
        if (!canBackup) {
            setProModalMessage('Backup & export is a Pro feature. Upgrade to unlock this and more.');
            setShowProModal(true);
            return;
        }
        const success = await shareBackup();
        if (!success) {
            Alert.alert('Error', 'Failed to export backup');
        }
    };

    const handleImport = async () => {
        if (!canBackup) {
            setProModalMessage('Backup & restore is a Pro feature. Upgrade to unlock this and more.');
            setShowProModal(true);
            return;
        }
        Alert.alert(
            'Import Backup',
            'This will merge the backup with your current data. Do you want to continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Import',
                    onPress: async () => {
                        const result = await importBackup();
                        if (result.success) {
                            Alert.alert('Success', `Imported ${result.count} items successfully.`);
                        } else if (result.error !== 'No file selected') {
                            Alert.alert('Error', result.error || 'Failed to import backup');
                        }
                    },
                },
            ]
        );
    };

    const getReturnReminderText = () => {
        const days = notificationSettings.returnLeadDays;
        if (days.length === 0) return 'Off';
        return `${Math.max(...days)} days before`;
    };

    const getWarrantyReminderText = () => {
        const days = notificationSettings.warrantyLeadDays;
        if (days.length === 0) return 'Off';
        return `${Math.max(...days)} days before`;
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="h1">Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Pro Section */}
                <Text variant="caption" color="textSecondary" style={styles.sectionTitle}>
                    PRO
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        {isPro ? (
                            <SettingsRow
                                label="Pro unlocked"
                                rightElement={
                                    <View style={styles.proUnlockedBadge}>
                                        <Text variant="bodySmall" color="textInverse">✓ Unlocked</Text>
                                    </View>
                                }
                            />
                        ) : (
                            <SettingsRow
                                label="Upgrade to Pro"
                                value="$4.99"
                                onPress={handleUpgradePress}
                            />
                        )}
                        <Divider spacing="none" />
                        <SettingsRow
                            label="Restore purchases"
                            value={isRestoring ? 'Restoring...' : undefined}
                            onPress={isRestoring ? undefined : handleRestorePurchases}
                            disabled={isRestoring}
                        />
                    </View>
                </Card>

                {/* Notification Permission */}
                {hasPermission === false && (
                    <View style={styles.permissionBanner}>
                        <Text variant="bodySmall" color="warning600">
                            Notifications are disabled. Enable them in Settings to receive reminders.
                        </Text>
                        <Pressable onPress={requestPermission} style={styles.enableButton}>
                            <Text variant="buttonSmall" color="primary600">Enable</Text>
                        </Pressable>
                    </View>
                )}

                <Text variant="caption" color="textSecondary" style={styles.sectionTitle}>
                    NOTIFICATIONS
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        <SettingsRow
                            label="Return reminder"
                            value={getReturnReminderText()}
                            onPress={handleReturnReminderPress}
                        />
                        <Divider spacing="none" />
                        <SettingsRow
                            label="Warranty reminder"
                            value={getWarrantyReminderText()}
                            onPress={handleWarrantyReminderPress}
                        />
                        <Divider spacing="none" />
                        <SettingsRow
                            label="Quiet hours"
                            rightElement={
                                <Switch
                                    value={notificationSettings.quietHoursEnabled}
                                    onValueChange={handleQuietHoursToggle}
                                    trackColor={{ false: colors.gray300, true: colors.primary500 }}
                                />
                            }
                        />
                    </View>
                </Card>

                <Text variant="caption" color="textSecondary" style={styles.sectionTitle}>
                    DATA
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        <SettingsRow 
                            label={isPro ? "Export backup" : "Export backup (Pro)"} 
                            onPress={handleExport} 
                        />
                        <Divider spacing="none" />
                        <SettingsRow 
                            label={isPro ? "Import backup" : "Import backup (Pro)"} 
                            onPress={handleImport} 
                        />
                    </View>
                </Card>

                <Text variant="caption" color="textSecondary" style={styles.sectionTitle}>
                    ABOUT
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        <SettingsRow label="Version" value="1.1.0" />
                        <Divider spacing="none" />
                        <SettingsRow label="Privacy Policy" onPress={() => { }} />
                        <Divider spacing="none" />
                        <SettingsRow label="Terms of Service" onPress={() => { }} />
                    </View>
                </Card>

                {/* DEV-only Diagnostics Section */}
                {shouldShowDiagnostics() && (
                    <>
                        <Text variant="caption" color="textSecondary" style={styles.sectionTitle}>
                            DEVELOPER
                        </Text>
                        <DiagnosticsSection />
                    </>
                )}

                <View style={styles.footer} />
            </ScrollView>

            {/* Pro Feature Modal */}
            <Modal
                visible={showProModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalCard}>
                        <Text variant="h2" style={styles.modalTitle}>
                            Pro Feature
                        </Text>
                        <Text variant="body" color="textSecondary" style={styles.modalText}>
                            {proModalMessage}
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button
                                title="Upgrade to Pro"
                                fullWidth
                                onPress={() => {
                                    setShowProModal(false);
                                    handleUpgradePress();
                                }}
                            />
                            <Pressable onPress={() => setShowProModal(false)} style={styles.dismissButton}>
                                <Text variant="body" color="textSecondary">
                                    Maybe Later
                                </Text>
                            </Pressable>
                        </View>
                    </Card>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: spacing.lg,
    },
    permissionBanner: {
        backgroundColor: colors.warning50,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.lg,
        marginTop: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    enableButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    sectionTitle: {
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    cardContent: {
        paddingHorizontal: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    rowDisabled: {
        opacity: 0.5,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        height: spacing.xxxl,
    },
    // Diagnostics styles
    diagnosticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    diagnosticsSection: {
        paddingVertical: spacing.sm,
    },
    diagnosticsHeader: {
        marginBottom: spacing.xs,
    },
    refreshRow: {
        justifyContent: 'center',
    },
    proUnlockedBadge: {
        backgroundColor: colors.success500,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalCard: {
        width: '100%',
        maxWidth: 340,
        padding: spacing.xl,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    modalButtons: {
        gap: spacing.md,
    },
    dismissButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
});
