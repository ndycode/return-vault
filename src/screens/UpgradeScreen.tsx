import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Text, Card, Button } from '../components/primitives';
import { colors, spacing, radius } from '../design';
import { useSettingsStore } from '../store/settingsStore';
import { purchasePro, restorePro, getProPrice } from '../utils/iap';

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
                Alert.alert('Success', 'Welcome to Pro!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else if (result.error && result.error !== 'USER_CANCELED') {
                Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
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
                    Alert.alert('Restored', 'Your Pro purchase has been restored.', [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
                } else {
                    Alert.alert('No Purchase Found', 'We couldn\'t find a Pro purchase to restore.');
                }
            } else {
                Alert.alert('Restore Failed', result.error || 'Could not restore purchases.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred during restore.');
        } finally {
            setIsRestoring(false);
        }
    };

    if (isPro) {
        return (
            <ScreenContainer>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Text variant="h1" style={styles.checkMark}>✓</Text>
                    </View>
                    <Text variant="h1" style={styles.successTitle}>You're a Pro!</Text>
                    <Text variant="body" color="textSecondary" style={styles.successText}>
                        Thank you for supporting Warranty Locker. You have access to all features.
                    </Text>
                    <View style={styles.successButton}>
                        <Button 
                            title="Go Back" 
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
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text variant="h1" style={styles.title}>Unlock Full Access</Text>
                    <Text variant="body" color="textSecondary" style={styles.subtitle}>
                        Get the most out of your warranty tracking
                    </Text>
                </View>

                <Card style={styles.priceCard}>
                    <Text variant="caption" color="primary600" style={styles.bestValue}>
                        LIFETIME ACCESS
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text variant="h1" style={styles.price}>{getProPrice()}</Text>
                        <Text variant="bodySmall" color="textSecondary" style={styles.period}>
                            / one-time
                        </Text>
                    </View>
                </Card>

                <View style={styles.featuresList}>
                    {PRO_FEATURES.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.featureIcon}>✓</Text>
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text variant="body" style={styles.featureTitle}>
                                    {feature.title}
                                </Text>
                                <Text variant="caption" color="textSecondary">
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
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 36,
        color: colors.primary600,
        fontWeight: '800',
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
        fontWeight: 'bold',
        fontSize: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontWeight: '600',
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
        color: colors.success600,
        fontSize: 40,
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
