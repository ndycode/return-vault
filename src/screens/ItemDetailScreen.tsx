/**
 * ItemDetailScreen
 * View/edit single purchase item
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp, CommonActions } from '@react-navigation/native';
import { ScreenContainer, Text, Card, Button, Divider } from '../components/primitives';
import { DeadlineTag } from '../components/DeadlineTag';
import {
    getPurchaseById,
    getAttachmentsByPurchaseId,
    updatePurchase,
    deletePurchase,
    archivePurchase
} from '../db';
import { shareProofPacket } from '../services/exportService';
import { Purchase, Attachment } from '../types';
import { HomeStackParamList } from '../navigation/HomeStack';
import { formatDisplayDate } from '../utils/dateUtils';
import { colors, spacing, radius } from '../design';
import { useSettingsStore, canUseProFeature } from '../store/settingsStore';

type DetailRouteProp = RouteProp<HomeStackParamList, 'ItemDetail'>;

interface DetailRowProps {
    label: string;
    value: string | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
    if (!value) return null;

    return (
        <>
            <View style={styles.row}>
                <Text variant="caption" color="textSecondary">{label}</Text>
                <Text variant="body" style={styles.rowValue}>{value}</Text>
            </View>
            <Divider spacing="sm" />
        </>
    );
}

export function ItemDetailScreen() {
    const route = useRoute<DetailRouteProp>();
    const navigation = useNavigation();
    const { itemId } = route.params;
    const isPro = useSettingsStore((s) => s.isPro);

    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [purchaseData, attachmentData] = await Promise.all([
                getPurchaseById(itemId),
                getAttachmentsByPurchaseId(itemId),
            ]);
            setPurchase(purchaseData);
            setAttachments(attachmentData);
        } catch (err) {
            console.error('Failed to load item:', err);
            Alert.alert('Error', 'Failed to load item details');
        } finally {
            setIsLoading(false);
        }
    }, [itemId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleShareProof = async () => {
        if (!purchase) return;

        // Check if user can export
        if (!canUseProFeature('EXPORT_PROOF', isPro)) {
            Alert.alert(
                'Pro Feature',
                'Exporting proof packets is a Pro feature. Upgrade to unlock this and more.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Upgrade',
                        onPress: () => {
                            navigation.dispatch(
                                CommonActions.navigate('Settings', {
                                    screen: 'Upgrade',
                                })
                            );
                        },
                    },
                ]
            );
            return;
        }

        const success = await shareProofPacket(purchase.id);
        if (!success) {
            Alert.alert('Error', 'Failed to share proof packet');
        }
    };

    const handleArchive = async () => {
        if (!purchase) return;

        Alert.alert(
            'Archive Item',
            'This will move the item to archived. You can still view it in the Archived filter.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Archive',
                    onPress: async () => {
                        try {
                            await archivePurchase(purchase.id);
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to archive item');
                        }
                    },
                },
            ]
        );
    };

    const handleDelete = () => {
        if (!purchase) return;

        Alert.alert(
            'Delete Item',
            'This will permanently delete this item and all its attachments. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePurchase(purchase.id);
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    },
                },
            ]
        );
    };

    if (isLoading || !purchase) {
        return (
            <ScreenContainer>
                <View style={styles.loading}>
                    <Text variant="body" color="textSecondary">Loading...</Text>
                </View>
            </ScreenContainer>
        );
    }

    const receiptAttachment = attachments.find((a) => a.type === 'receipt');

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text variant="h1" numberOfLines={2}>{purchase.name}</Text>
                    {purchase.status === 'archived' && (
                        <View style={styles.archivedBadge}>
                            <Text variant="caption" color="textSecondary">Archived</Text>
                        </View>
                    )}
                </View>

                {/* Photo */}
                <View style={styles.photoContainer}>
                    {receiptAttachment ? (
                        <Image
                            source={{ uri: receiptAttachment.uri }}
                            style={styles.photo}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Text variant="body" color="textSecondary">No photo</Text>
                        </View>
                    )}
                </View>

                {/* Deadline Tags */}
                <View style={styles.tagsContainer}>
                    {purchase.returnDeadline && (
                        <DeadlineTag deadline={purchase.returnDeadline} type="return" />
                    )}
                    {purchase.warrantyExpiry && (
                        <DeadlineTag deadline={purchase.warrantyExpiry} type="warranty" />
                    )}
                </View>

                {/* Details Card */}
                <Card>
                    <DetailRow label="Store" value={purchase.store} />
                    <DetailRow
                        label="Price"
                        value={purchase.price ? `$${purchase.price.toFixed(2)}` : null}
                    />
                    <DetailRow
                        label="Purchase Date"
                        value={formatDisplayDate(purchase.purchaseDate)}
                    />
                    <DetailRow
                        label="Return Deadline"
                        value={purchase.returnDeadline ? formatDisplayDate(purchase.returnDeadline) : null}
                    />
                    <DetailRow
                        label="Warranty Expiry"
                        value={purchase.warrantyExpiry ? formatDisplayDate(purchase.warrantyExpiry) : null}
                    />
                    <DetailRow label="Serial Number" value={purchase.serialNumber} />
                    <DetailRow label="Notes" value={purchase.notes} />
                </Card>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title={isPro ? "Share Proof" : "Share Proof (Pro)"}
                        variant="secondary"
                        fullWidth
                        onPress={handleShareProof}
                    />
                    <View style={styles.actionSpacer} />
                    {purchase.status === 'active' && (
                        <>
                            <Button
                                title="Archive"
                                variant="ghost"
                                fullWidth
                                onPress={handleArchive}
                            />
                            <View style={styles.actionSpacer} />
                        </>
                    )}
                    <Button
                        title="Delete"
                        variant="ghost"
                        fullWidth
                        onPress={handleDelete}
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    archivedBadge: {
        backgroundColor: colors.gray100,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        alignSelf: 'flex-start',
        marginTop: spacing.sm,
    },
    photoContainer: {
        marginBottom: spacing.lg,
    },
    photo: {
        width: '100%',
        height: 200,
        borderRadius: radius.lg,
    },
    photoPlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: radius.lg,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    row: {
        paddingVertical: spacing.xs,
    },
    rowValue: {
        marginTop: spacing.xs,
    },
    actions: {
        marginTop: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    actionSpacer: {
        height: spacing.sm,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
