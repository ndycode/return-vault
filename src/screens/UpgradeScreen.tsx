/**
 * UpgradeScreen
 * Pro upgrade and restore flow
 * 
 * v1.06-D: System Confidence Layer
 * - Enterprise-grade messaging
 * - No celebratory animations
 * - Calm, factual confirmations
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Text, Card, Button } from '../components/primitives';
import { colors, spacing, radius } from '../design';
import { useSettingsStore } from '../store/settingsStore';
import { purchasePro, restorePro, getProPrice } from '../utils/iap';
import { SUCCESS, ERROR, ALERT_TITLES } from '../utils/copy';

const PRO_FEATURES = [
    { title: 'Unlimited Items', description: 'Store more than 10 items' },
    { title: 'Export Proof Packets', description: 'Generate PDF reports for claims' },
    { title: 'Backup & Restore', description: 'Keep your data safe' },
    { title: 'Advanced Notifications', description: 'Custom alerts and reminders' },
];

export function UpgradeScreen() {
    const navigation = useNavigation();
    const isPro = useSettingsStore((s) => s.isPro);
    const [isLoading, setIsLoading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const result = await purchasePro();
            if (result.success) {
                Alert.alert(ALERT_TITLES.PRO_UNLOCKED, SUCCESS.PRO_UNLOCKED, [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else if (result.error && result.error !== 'USER_CANCELED') {
                Alert.alert(ALERT_TITLES.ERROR, ERROR.PURCHASE_FAILED);
            }
        } catch (error) {
            Alert.alert(ALERT_TITLES.ERROR, ERROR.GENERIC);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const result = await restorePro();
            if (result.success) {
                if (result.hasPro) {
                    Alert.alert(ALERT_TITLES.RESTORE, SUCCESS.PRO_RESTORED, [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
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

    if (isPro) {
        return (
            <ScreenContainer>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Text variant="symbolXL" color="success600" style={styles.checkMark}>✓</Text>
                    </View>
                    <Text variant="screenTitle" style={styles.successTitle}>Pro Active</Text>
                    <Text variant="body" color="textSecondary" style={styles.successText}>
                        All features unlocked. Your data is stored locally on this device.
                    </Text>
                    <View style={styles.successButton}>
                        <Button
                            title="Done"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text variant="screenTitle" style={styles.title}>Unlock Full Access</Text>
                    <Text variant="body" color="textSecondary" style={styles.subtitle}>
                        Get the most out of your warranty tracking
                    </Text>
                </View>

                <Card style={styles.priceCard}>
                    <Text variant="label" color="primary600" style={styles.bestValue}>
                        LIFETIME ACCESS
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text variant="display" style={styles.price}>{getProPrice()}</Text>
                        <Text variant="secondary" color="textSecondary" style={styles.period}>
                            / one-time
                        </Text>
                    </View>
                </Card>

                <View style={styles.featuresList}>
                    {PRO_FEATURES.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.iconContainer}>
                                <Text variant="symbolMd" style={styles.featureIcon}>✓</Text>
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text variant="label" style={styles.featureTitle}>
                                    {feature.title}
                                </Text>
                                <Text variant="meta" color="textSecondary">
                                    {feature.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <View style={styles.upgradeButton}>
                        <Button
                            title={isLoading ? "Processing..." : "Upgrade to Pro"}
                            onPress={handlePurchase}
                            loading={isLoading}
                            disabled={isLoading || isRestoring}
                            fullWidth
                        />
                    </View>

                    <View style={styles.restoreButton}>
                        <Button
                            title={isRestoring ? "Restoring..." : "Restore Purchases"}
                            onPress={handleRestore}
                            variant="ghost"
                            disabled={isLoading || isRestoring}
                            fullWidth
                        />
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
    },
    priceCard: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: colors.primary50,
        borderColor: colors.primary100,
        borderWidth: 1,
        marginBottom: spacing.xl,
        shadowColor: colors.primary500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    bestValue: {
        letterSpacing: 1.5,
        marginBottom: spacing.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        color: colors.primary600,
    },
    period: {
        marginLeft: spacing.xs,
    },
    featuresList: {
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.sm,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    featureIcon: {
        color: colors.primary600,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        marginBottom: 2,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: spacing.lg,
    },
    upgradeButton: {
        marginBottom: spacing.sm,
    },
    restoreButton: {
        marginTop: spacing.xs,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.success50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    checkMark: {
        // color handled by props or kept here if not in props
    },
    successTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    successText: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    successButton: {
        minWidth: 200,
    },
});
