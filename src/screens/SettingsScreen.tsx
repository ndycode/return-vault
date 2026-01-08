/**
 * SettingsScreen
 * App preferences and safety actions
 * 
 * v1.06-F: Settings Decomposition & Enterprise-Boring Settings
 * v1.06-D: System Confidence Layer - Enterprise-grade messaging
 * 
 * DESIGN PRINCIPLES:
 * - Settings is infrastructure, not product
 * - Low-frequency actions require deliberate intent
 * - High-risk actions are visually isolated
 * - No marketing language, no discovery surface
 * 
 * SECTION ORDER (fixed, intent-based):
 * 1. NOTIFICATIONS - Reminder timing, permissions (medium risk)
 * 2. ACCOUNT - Pro status, restore (low frequency, informational)
 * 3. DATA & SAFETY - Backup/restore (high risk, isolated, collapsible)
 * 4. APP INFO - Version, legal (read-only, quiet, collapsible)
 * 5. DEVELOPER - Diagnostics (dev-only, hidden in production)
 * 
 * CONFIRMATION RULES:
 * - Preferences: NEVER require confirmation
 * - Read-only info: NEVER require confirmation
 * - Import backup: ALWAYS confirm (data merge)
 * - Export backup: NO confirmation (non-destructive)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Card, Divider, Button, CollapsibleSection } from '../components/primitives';
import { useSettingsStore, canUseProFeature } from '../store/settingsStore';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { colors, spacing, radius } from '../design';
import {
    collectDiagnostics,
    shouldShowDiagnostics,
    DiagnosticsData,
} from '../services/diagnosticsService';
import { shareBackup, importBackup } from '../services/exportService';
import { restorePro } from '../utils/iap';
import { SUCCESS, ERROR, ALERT_TITLES, CONFIRM } from '../utils/copy';
import { SettingsStackParamList } from '../navigation/SettingsStack';

interface SettingsRowProps {
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    disabled?: boolean;
    /** Reduce visual prominence for low-frequency options */
    quiet?: boolean;
}

function SettingsRow({ label, value, onPress, rightElement, disabled, quiet }: SettingsRowProps) {
    const content = (
        <View style={[styles.row, disabled && styles.rowDisabled]}>
            <Text
                variant={quiet ? 'secondary' : 'body'}
                color={disabled ? 'textTertiary' : quiet ? 'textSecondary' : 'textPrimary'}
            >
                {label}
            </Text>
            <View style={styles.rowRight}>
                {value && (
                    <Text variant={quiet ? 'secondary' : 'body'} color="textSecondary">
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
                return colors.success500;
            case 'warn':
                return colors.warning500;
            case 'error':
                return colors.error500;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <View style={styles.diagnosticsRow}>
            <Text variant="secondary" color="textSecondary">
                {label}
            </Text>
            <Text
                variant="secondary"
                style={{ color: getStatusColor() }}
            >
                {value}
            </Text>
        </View>
    );
}

function DiagnosticsContent() {
    const [diagnostics, setDiagnostics] = React.useState<DiagnosticsData | null>(null);
    const [loading, setLoading] = React.useState(true);

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
            <View style={styles.diagnosticsLoading}>
                <Text variant="secondary" color="textSecondary">
                    Loading diagnostics...
                </Text>
            </View>
        );
    }

    if (!diagnostics) {
        return null;
    }

    return (
        <View style={styles.diagnosticsContent}>
            <View style={styles.diagnosticsSection}>
                <Text variant="label" color="textTertiary" style={styles.diagnosticsHeader}>
                    DATABASE
                </Text>
                <DiagnosticsRow
                    label="Schema Version"
                    value={`${diagnostics.database.schemaVersion} / ${diagnostics.database.expectedVersion}`}
                    status={diagnostics.database.isUpToDate ? 'ok' : 'error'}
                />
            </View>

            <View style={styles.diagnosticsSection}>
                <Text variant="label" color="textTertiary" style={styles.diagnosticsHeader}>
                    PURCHASES
                </Text>
                <DiagnosticsRow label="Total" value={String(diagnostics.purchases.total)} />
                <DiagnosticsRow label="Active" value={String(diagnostics.purchases.active)} />
                <DiagnosticsRow label="Archived" value={String(diagnostics.purchases.archived)} />
            </View>

            <View style={styles.diagnosticsSection}>
                <Text variant="label" color="textTertiary" style={styles.diagnosticsHeader}>
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

            <View style={styles.diagnosticsSection}>
                <Text variant="label" color="textTertiary" style={styles.diagnosticsHeader}>
                    BACKUP
                </Text>
                <DiagnosticsRow
                    label="Last Backup"
                    value={diagnostics.backup.lastBackupDate ?? 'Never'}
                    status={diagnostics.backup.lastBackupDate ? 'ok' : 'warn'}
                />
            </View>

            <TouchableOpacity onPress={loadDiagnostics} activeOpacity={0.7}>
                <View style={styles.refreshRow}>
                    <Text variant="buttonSmall" color="primary600">
                        Refresh
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
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
                    Alert.alert(ALERT_TITLES.RESTORE, SUCCESS.PRO_RESTORED);
                } else {
                    Alert.alert(ALERT_TITLES.RESTORE, ERROR.NO_PURCHASE_FOUND);
                }
            } else {
                Alert.alert(ALERT_TITLES.ERROR, ERROR.RESTORE_FAILED);
            }
        } catch (error) {
            Alert.alert(ALERT_TITLES.ERROR, ERROR.GENERIC);
        } finally {
            setIsRestoring(false);
        }
    };

    const handleReturnReminderPress = () => {
        Alert.alert(
            'Return reminder',
            'Reminder timing',
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
            'Warranty reminder',
            'Reminder timing',
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
            setProModalMessage('Backup requires Pro.');
            setShowProModal(true);
            return;
        }
        const success = await shareBackup();
        if (!success) {
            Alert.alert(ALERT_TITLES.ERROR, ERROR.BACKUP_FAILED);
        }
    };

    const handleImport = async () => {
        if (!canBackup) {
            setProModalMessage('Restore requires Pro.');
            setShowProModal(true);
            return;
        }
        Alert.alert(
            CONFIRM.IMPORT.title,
            CONFIRM.IMPORT.message,
            [
                { text: CONFIRM.IMPORT.cancel, style: 'cancel' },
                {
                    text: CONFIRM.IMPORT.confirm,
                    onPress: async () => {
                        const result = await importBackup();
                        if (result.success) {
                            Alert.alert(ALERT_TITLES.INFO, SUCCESS.BACKUP_IMPORTED(result.count));
                        } else if (result.error !== 'No file selected') {
                            Alert.alert(ALERT_TITLES.ERROR, ERROR.IMPORT_FAILED);
                        }
                    },
                },
            ]
        );
    };

    const getReturnReminderText = () => {
        const days = notificationSettings.returnLeadDays;
        if (days.length === 0) return 'Off';
        return `${Math.max(...days)} days`;
    };

    const getWarrantyReminderText = () => {
        const days = notificationSettings.warrantyLeadDays;
        if (days.length === 0) return 'Off';
        return `${Math.max(...days)} days`;
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="screenTitle">Settings</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
            >
                {/* ─────────────────────────────────────────────
                    SECTION 1: NOTIFICATIONS (Daily behavior)
                    Most frequently adjusted - always visible
                ───────────────────────────────────────────── */}

                {/* Permission banner - context-dependent */}
                {hasPermission === false && (
                    <View style={styles.permissionBanner}>
                        <Text variant="secondary" color="warning600">
                            Notifications disabled
                        </Text>
                        <Pressable onPress={requestPermission} style={styles.enableButton}>
                            <Text variant="buttonSmall" color="primary600">Enable</Text>
                        </Pressable>
                    </View>
                )}

                <Text variant="label" color="textSecondary" style={styles.sectionTitle}>
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

                {/* ─────────────────────────────────────────────
                    SECTION 2: ACCOUNT (Pro status)
                    Less frequent - collapsible
                ───────────────────────────────────────────── */}
                <Text variant="label" color="textSecondary" style={styles.sectionTitle}>
                    ACCOUNT
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        {isPro ? (
                            <SettingsRow
                                label="Pro unlocked"
                                rightElement={
                                    <View style={styles.proUnlockedBadge}>
                                        <Text variant="symbolMd" color="textInverse">✓</Text>
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
                            quiet
                        />
                    </View>
                </Card>

                {/* ─────────────────────────────────────────────
                    SECTION 3: DATA & SAFETY (Backup/Restore)
                    High-risk actions - collapsed, visually isolated
                ───────────────────────────────────────────── */}
                <Text variant="label" color="textSecondary" style={styles.sectionTitle}>
                    DATA & SAFETY
                </Text>
                <Card padding="none">
                    <View style={styles.cardContent}>
                        <CollapsibleSection
                            title="Backup & restore"
                            triggerLabel="Backup & restore"
                            defaultExpanded={false}
                        >
                            <View style={styles.dataContent}>
                                <SettingsRow
                                    label="Export backup"
                                    onPress={handleExport}
                                    disabled={!isPro}
                                    quiet={!isPro}
                                />
                                <Divider spacing="none" />
                                <SettingsRow
                                    label="Import backup"
                                    onPress={handleImport}
                                    disabled={!isPro}
                                    quiet={!isPro}
                                />
                            </View>
                        </CollapsibleSection>
                    </View>
                </Card>

                {/* ─────────────────────────────────────────────
                    SECTION 4: APP INFO (Legal/Info)
                    Rarely touched - collapsed, visually quiet
                ───────────────────────────────────────────── */}
                <Text variant="label" color="textTertiary" style={styles.sectionTitle}>
                    APP INFO
                </Text>
                <Card padding="none" style={styles.quietCard}>
                    <View style={styles.cardContent}>
                        <CollapsibleSection
                            title="App info"
                            triggerLabel="Version & legal"
                            defaultExpanded={false}
                        >
                            <View style={styles.aboutContent}>
                                <SettingsRow label="Version" value="1.1.0" quiet />
                                <Divider spacing="none" />
                                <SettingsRow label="Privacy policy" onPress={() => { }} quiet />
                                <Divider spacing="none" />
                                <SettingsRow label="Terms of service" onPress={() => { }} quiet />
                            </View>
                        </CollapsibleSection>
                    </View>
                </Card>

                {/* ─────────────────────────────────────────────
                    SECTION 5: DEVELOPER (Dev-only)
                    Hidden in production
                ───────────────────────────────────────────── */}
                {shouldShowDiagnostics() && (
                    <>
                        <Text variant="label" color="textTertiary" style={styles.sectionTitle}>
                            DEVELOPER
                        </Text>
                        <Card padding="none" style={styles.quietCard}>
                            <View style={styles.cardContent}>
                                <CollapsibleSection
                                    title="Diagnostics"
                                    triggerLabel="Diagnostics"
                                    defaultExpanded={false}
                                >
                                    <DiagnosticsContent />
                                </CollapsibleSection>
                            </View>
                        </Card>
                    </>
                )}

                <View style={styles.footer} />
            </ScrollView>

            {/* Pro Required Modal - neutral, non-marketing */}
            <Modal
                visible={showProModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalCard}>
                        <Text variant="sectionHeader" style={styles.modalTitle}>
                            Pro required
                        </Text>
                        <Text variant="body" color="textSecondary" style={styles.modalText}>
                            {proModalMessage}
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button
                                title="View Pro"
                                fullWidth
                                onPress={() => {
                                    setShowProModal(false);
                                    handleUpgradePress();
                                }}
                            />
                            <Pressable onPress={() => setShowProModal(false)} style={styles.dismissButton}>
                                <Text variant="body" color="textSecondary">
                                    Cancel
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
        paddingTop: spacing.lg, // 16px
        paddingBottom: spacing.lg, // 16px
    },
    permissionBanner: {
        backgroundColor: colors.warning50,
        padding: spacing.lg, // 16px
        borderRadius: radius.sm,
        marginBottom: spacing.md, // 12px
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    enableButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    sectionTitle: {
        marginTop: spacing.xl, // 24px
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    cardContent: {
        paddingHorizontal: spacing.lg, // 16px
    },
    quietCard: {
        opacity: 0.9,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg, // 16px
        minHeight: 48,
    },
    rowDisabled: {
        opacity: 0.5,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dataContent: {
        paddingTop: spacing.xs,
    },
    aboutContent: {
        paddingTop: spacing.xs,
    },
    footer: {
        height: spacing.xxxl, // 48px
    },
    // Diagnostics styles
    diagnosticsLoading: {
        paddingVertical: spacing.lg,
    },
    diagnosticsContent: {
        paddingTop: spacing.sm,
    },
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
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    proUnlockedBadge: {
        backgroundColor: colors.success500,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg, // 16px
    },
    modalCard: {
        width: '100%',
        maxWidth: 320,
        padding: spacing.xl, // 24px
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: spacing.xl, // 24px
    },
    modalButtons: {
        gap: spacing.sm,
    },
    dismissButton: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
});
