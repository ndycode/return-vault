/**
 * ItemCard Component
 * Purchase list item card
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from './primitives';
import { DeadlineTag } from './DeadlineTag';
import { Purchase } from '../types';
import { colors, spacing, radius } from '../design';

interface ItemCardProps {
    purchase: Purchase;
    onPress: () => void;
}

export function ItemCard({ purchase, onPress }: ItemCardProps) {
    const hasReturnDeadline = purchase.returnDeadline !== null;
    const hasWarrantyExpiry = purchase.warrantyExpiry !== null;

    return (
        <Card onPress={onPress} padding="md">
            <View style={styles.row}>
                <View style={styles.thumbnail}>
                    <View style={styles.thumbnailPlaceholder} />
                </View>
                <View style={styles.content}>
                    <Text variant="h3" numberOfLines={1}>
                        {purchase.name}
                    </Text>
                    {purchase.store && (
                        <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
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
        width: 56,
        height: 56,
        borderRadius: radius.md,
        overflow: 'hidden',
        marginRight: spacing.md,
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.gray200,
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
});
