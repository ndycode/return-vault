/**
 * ItemCard Component
 * Purchase list item card with urgency-aware styling
 *
 * VISUAL HIERARCHY:
 * - URGENT: Full opacity, accent border
 * - UPCOMING: Normal appearance
 * - REFERENCE: Reduced opacity
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card, Text } from './primitives';
import { DeadlineTag } from './DeadlineTag';
import { Purchase } from '../types';
import { colors, spacing, radius } from '../design';
import { UrgencyTier, getUrgencyTier } from '../utils/urgency';

interface ItemCardProps {
    purchase: Purchase;
    onPress: () => void;
    /** Override urgency tier (used when parent already computed it) */
    urgencyTier?: UrgencyTier;
}

export function ItemCard({ purchase, onPress, urgencyTier }: ItemCardProps) {
    const tier = urgencyTier ?? getUrgencyTier(purchase);
    const hasReturnDeadline = purchase.returnDeadline !== null;
    const hasWarrantyExpiry = purchase.warrantyExpiry !== null;

    // Visual weight based on urgency tier
    const getContainerStyle = (): ViewStyle => {
        switch (tier) {
            case 'urgent':
                return styles.containerUrgent;
            case 'upcoming':
                return styles.containerUpcoming;
            case 'reference':
                return styles.containerReference;
        }
    };

    const getTitleColor = (): 'textPrimary' | 'textSecondary' => {
        return tier === 'reference' ? 'textSecondary' : 'textPrimary';
    };

    return (
        <Card onPress={onPress} padding="md" style={getContainerStyle()}>
            <View style={styles.row}>
                <View style={styles.thumbnail}>
                    <View style={[
                        styles.thumbnailPlaceholder,
                        tier === 'urgent' && styles.thumbnailUrgent,
                    ]} />
                </View>
                <View style={styles.content}>
                    <Text
                        variant="title"
                        numberOfLines={1}
                        color={getTitleColor()}
                    >
                        {purchase.name}
                    </Text>
                    {purchase.store && (
                        <Text
                            variant="secondary"
                            color="textSecondary"
                            numberOfLines={1}
                            style={tier === 'reference' ? styles.textMuted : undefined}
                        >
                            {purchase.store}
                        </Text>
                    )}
                    <View style={styles.tags}>
                        {hasReturnDeadline && (
                            <DeadlineTag deadline={purchase.returnDeadline!} type="return" />
                        )}
                        {hasWarrantyExpiry && !hasReturnDeadline && (
                            <DeadlineTag deadline={purchase.warrantyExpiry!} type="warranty" />
                        )}
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: radius.sm, // 6px
        overflow: 'hidden',
        marginRight: spacing.md, // 12px
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.gray200,
    },
    thumbnailUrgent: {
        backgroundColor: colors.error100,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    // Urgency-based container styles
    containerUrgent: {
        borderLeftWidth: 3,
        borderLeftColor: colors.error500,
    },
    containerUpcoming: {
        // Normal appearance
    },
    containerReference: {
        opacity: 0.7,
    },
    textMuted: {
        opacity: 0.8,
    },
});
