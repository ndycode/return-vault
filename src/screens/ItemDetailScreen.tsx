/**
 * ItemDetailScreen
 * View/edit single purchase item with urgency-first hierarchy
 *
 * v1.06-C: Progressive Disclosure
 * SECTION ORDER (fixed - never changes):
 * 1. URGENT BANNER (context-dependent - only if urgent)
 * 2. HEADER + DEADLINE TAGS (always visible - primary info)
 * 3. PROOF PHOTO (always visible - primary evidence)
 * 4. PURCHASE DETAILS (collapsed by default - secondary info)
 * 5. ACTIONS (always visible - primary CTA)
 *
 * v1.06-D: System Confidence Layer
 * - Enterprise-grade error messaging
 * - Clear confirmation dialogs
 * - Recovery-focused error handling
 *
 * Rules:
 * - User should immediately see: status, deadlines, photo
 * - Details are one tap away, not competing for attention
 * - Actions always visible without scrolling on standard screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp, CommonActions } from '@react-navigation/native';
import { ScreenContainer, Text, Card, Button, Divider, CollapsibleSection, SystemStatus } from '../components/primitives';
import { DeadlineTag } from '../components/DeadlineTag';
import {
    getPurchaseById,
    getAttachmentsByPurchaseId,
    deletePurchase,
    archivePurchase,
    restorePurchase
} from '../db';
import { shareProofPacket } from '../services/exportService';
import { Purchase, Attachment } from '../types';
import { HomeStackParamList } from '../navigation/HomeStack';
import { formatDisplayDate } from '../utils/dateUtils';
import { getUrgencyClassification } from '../utils/urgency';
import { ERROR, ALERT_TITLES, CONFIRM, REASSURANCE } from '../utils/copy';
import { colors, spacing, radius } from '../design';
import { useSettingsStore, canUseProFeature } from '../store/settingsStore';
import { useUndoStore } from '../store/undoStore';

type DetailRouteProp = RouteProp<HomeStackParamList, 'ItemDetail'>;

interface DetailRowProps {
    label: string;
    value: string | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
    if (!value) return null;

    return (
        <View style={styles.row}>
            <Text variant="meta" color="textSecondary">
                {label}
            </Text>
            <Text variant="body" style={styles.rowValue}>
                {value}
            </Text>
        </View>
    );
}

/**
 * Urgent status banner - shown at top when item requires action
 */
function UrgentBanner({ urgency }: { urgency: ReturnType<typeof getUrgencyClassification> }) {
    if (urgency.tier !== 'urgent') {
        return null;
    }

    const getMessage = () => {
        if (urgency.isOverdue) {
            const days = Math.abs(urgency.daysRemaining || 0);
            const type = urgency.primaryDeadline === 'return' ? 'Return' : 'Warranty';
            return `${type} ${days} day${days !== 1 ? 's' : ''} overdue`;
        }

        const days = urgency.daysRemaining || 0;
        const type = urgency.primaryDeadline === 'return' ? 'Return due' : 'Warranty expires';
        if (days === 0) {
            return `${type} today`;
        }
        return `${type} in ${days} day${days !== 1 ? 's' : ''}`;
    };

    return (
        <View style={styles.urgentBanner}>
            <Text variant="body" color="textInverse" style={styles.urgentBannerText}>
                {getMessage()}
            </Text>
        </View>
    );
}

export function ItemDetailScreen() {
    const route = useRoute<DetailRouteProp>();
    const navigation = useNavigation();
    const { itemId } = route.params;
    const isPro = useSettingsStore((s) => s.isPro);
    const showUndo = useUndoStore((s) => s.showUndo);

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
            Alert.alert(ALERT_TITLES.ERROR, ERROR.LOAD_FAILED);
        } finally {
            setIsLoading(false);
        }
    }, [itemId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleShareProof = async () => {
        if (!purchase) return;

        if (!canUseProFeature('EXPORT_PROOF', isPro)) {
            Alert.alert(
                ALERT_TITLES.PRO_FEATURE,
                'Exporting proof packets is a Pro feature. Upgrade to unlock.',
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
            Alert.alert(ALERT_TITLES.ERROR, ERROR.SHARE_FAILED);
        }
    };

    /**
     * v1.06-B: Archive with undo (no confirmation dialog)
     * - Immediately archives
     * - Shows undo toast for 5 seconds
     * - User can restore if action was accidental
     */
    const handleArchive = async () => {
        if (!purchase) return;

        try {
            await archivePurchase(purchase.id);
            // Show undo toast and navigate
            showUndo(`"${purchase.name}" archived`, async () => {
                await restorePurchase(purchase.id);
            });
            navigation.goBack();
        } catch (err) {
            Alert.alert(ALERT_TITLES.ERROR, ERROR.ARCHIVE_FAILED);
        }
    };

    const handleDelete = () => {
        if (!purchase) return;

        Alert.alert(
            CONFIRM.DELETE.title,
            CONFIRM.DELETE.message,
            [
                { text: CONFIRM.DELETE.cancel, style: 'cancel' },
                {
                    text: CONFIRM.DELETE.confirm,
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePurchase(purchase.id);
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert(ALERT_TITLES.ERROR, ERROR.DELETE_FAILED);
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

    const urgency = getUrgencyClassification(purchase);
    const receiptAttachment = attachments.find((a) => a.type === 'receipt');
    const hasDeadlines = purchase.returnDeadline || purchase.warrantyExpiry;
    const hasExtendedInfo = purchase.serialNumber || purchase.notes;

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ─────────────────────────────────────────────
                    SECTION 1: URGENT BANNER (context-dependent)
                    Only appears when action is required
                ───────────────────────────────────────────── */}
                <UrgentBanner urgency={urgency} />

                {/* ─────────────────────────────────────────────
                    SECTION 2: HEADER + DEADLINES (always visible)
                    Primary identification + urgency status
                ───────────────────────────────────────────── */}
                <View style={styles.header}>
                    <Text variant="screenTitle" numberOfLines={2}>{purchase.name}</Text>
                    {purchase.status === 'archived' && (
                        <View style={styles.archivedBadge}>
                            <Text variant="meta" color="textSecondary">Archived</Text>
                        </View>
                    )}
                    {/* v1.06-D: Passive reassurance - data safety indicator */}
                    <View style={styles.statusRow}>
                        <SystemStatus message={REASSURANCE.SAVED_LOCALLY} showCheck variant="success" />
                    </View>
                </View>

                {hasDeadlines && (
                    <View style={styles.tagsContainer}>
                        {purchase.returnDeadline && (
                            <DeadlineTag deadline={purchase.returnDeadline} type="return" />
                        )}
                        {purchase.warrantyExpiry && (
                            <DeadlineTag deadline={purchase.warrantyExpiry} type="warranty" />
                        )}
                    </View>
                )}

                {/* ─────────────────────────────────────────────
                    SECTION 3: PROOF PHOTO (always visible)
                    Primary evidence - immediate visual confirmation
                ───────────────────────────────────────────── */}
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

                {/* ─────────────────────────────────────────────
                    SECTION 4: DETAILS (collapsed by default)
                    Secondary info - revealed on demand
                ───────────────────────────────────────────── */}
                <Card style={styles.detailsCard}>
                    <CollapsibleSection
                        title="Hide details"
                        triggerLabel="View details"
                        defaultExpanded={false}
                    >
                        <View style={styles.detailsContent}>
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
                            {hasExtendedInfo && (
                                <>
                                    <Divider spacing="sm" />
                                    <DetailRow label="Serial Number" value={purchase.serialNumber} />
                                    <DetailRow label="Notes" value={purchase.notes} />
                                </>
                            )}
                        </View>
                    </CollapsibleSection>
                </Card>

                {/* ─────────────────────────────────────────────
                    SECTION 5: ACTIONS (always visible)
                    Primary CTA - no scroll needed to access
                ───────────────────────────────────────────── */}
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
        paddingBottom: spacing.sm,
    },
    archivedBadge: {
        backgroundColor: colors.gray100,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        alignSelf: 'flex-start',
        marginTop: spacing.sm,
    },
    statusRow: {
        marginTop: spacing.sm,
    },
    urgentBanner: {
        backgroundColor: colors.error500,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginHorizontal: -spacing.md,
        marginTop: -spacing.sm,
    },
    urgentBannerText: {
        textAlign: 'center',
        fontWeight: '600',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    photoContainer: {
        marginBottom: spacing.md,
    },
    photo: {
        width: '100%',
        height: 180,
        borderRadius: radius.lg,
    },
    photoPlaceholder: {
        width: '100%',
        height: 100,
        borderRadius: radius.lg,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsCard: {
        marginBottom: spacing.md,
    },
    detailsContent: {
        paddingTop: spacing.sm,
    },
    row: {
        paddingVertical: spacing.xs,
    },
    rowValue: {
        marginTop: spacing.xs,
    },
    actions: {
        marginTop: spacing.md,
        paddingBottom: spacing.xxl,
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
