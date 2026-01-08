/**
 * ItemCard Component
 * Purchase list item card with urgency-aware styling
 *
 * VISUAL HIERARCHY:
 * - URGENT: Full opacity, accent border
 * - UPCOMING: Normal appearance
 * - REFERENCE: Reduced opacity
 */

import React, { useMemo } from 'react';
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

    // Memoize style calculations based on urgency tier
    const containerStyle = useMemo((): ViewStyle => {
        switch (tier) {
            case 'urgent':
                return styles.containerUrgent;
            case 'upcoming':
                return styles.containerUpcoming;
            case 'reference':
                return styles.containerReference;
        }
    }, [tier]);

    const titleColor = useMemo((): 'textPrimary' | 'textSecondary' => {
        return tier === 'reference' ? 'textSecondary' : 'textPrimary';
    }, [tier]);

    const textMutedStyle = useMemo(() => {
        return tier === 'reference' ? styles.textMuted : undefined;
    }, [tier]);

    const thumbnailStyle = useMemo(() => {
        return tier === 'urgent' ? styles.thumbnailUrgent : undefined;
    }, [tier]);

    return (
        <Card onPress={onPress} padding="md" style={containerStyle}>
            <View style={styles.row}>
                <View style={styles.thumbnail}>
                    <View style={[
                        styles.thumbnailPlaceholder,
                        thumbnailStyle,
                    ]} />
                </View>
                <View style={styles.content}>
                    <Text
                        variant="title"
                        numberOfLines={1}
                        color={titleColor}
                    >
                        {purchase.name}
                    </Text>
                    {purchase.store && (
                        <Text
                            variant="secondary"
                            color="textSecondary"
                            numberOfLines={1}
                            style={textMutedStyle}
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
