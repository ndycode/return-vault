/**
 * ActionTodayScreen
 * Displays ONLY urgent items requiring immediate attention
 *
 * HIERARCHY SPEC:
 * This screen shows ONLY urgent tier items:
 * - Overdue returns
 * - Returns due within 3 days
 * - Warranty expiring within 7 days
 *
 * No informational or historical content allowed.
 * If nothing urgent, show calm "All clear" state.
 */

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Text, Card } from '../components/primitives';
import { ItemCard } from '../components/ItemCard';
import { EmptyState } from '../components/EmptyState';
import { usePurchases } from '../hooks/usePurchases';
import { Purchase } from '../types';
import { colors, spacing } from '../design';
import {
    filterUrgent,
    getUrgencyClassification,
    sortByUrgency,
} from '../utils/urgency';

interface Section {
    title: string;
    type: 'overdue' | 'dueSoon';
    data: Purchase[];
}

export function ActionTodayScreen() {
    const router = useRouter();
    const { purchases, isLoading, isRefreshing, refresh } = usePurchases({ status: 'active' });



    // Filter to only urgent items and categorize
    const { overdueItems, dueSoonItems, totalCount } = useMemo(() => {
        const urgentItems = filterUrgent(purchases);

        const overdue: Purchase[] = [];
        const dueSoon: Purchase[] = [];

        for (const item of urgentItems) {
            const classification = getUrgencyClassification(item);
            if (classification.isOverdue) {
                overdue.push(item);
            } else {
                dueSoon.push(item);
            }
        }

        return {
            overdueItems: sortByUrgency(overdue),
            dueSoonItems: sortByUrgency(dueSoon),
            totalCount: overdue.length + dueSoon.length,
        };
    }, [purchases]);

    const handleItemPress = (purchase: Purchase) => {
        router.push(`/${purchase.id}`);
    };

    // Build sections - overdue first, then due soon
    const sections: Section[] = useMemo(() => {
        const result: Section[] = [];

        if (overdueItems.length > 0) {
            result.push({
                title: 'Overdue',
                type: 'overdue',
                data: overdueItems,
            });
        }

        if (dueSoonItems.length > 0) {
            result.push({
                title: 'Due Soon',
                type: 'dueSoon',
                data: dueSoonItems,
            });
        }

        return result;
    }, [overdueItems, dueSoonItems]);

    const renderSectionHeader = ({ section }: { section: Section }) => {
        const getHeaderColor = () => {
            switch (section.type) {
                case 'overdue':
                    return colors.error500;
                case 'dueSoon':
                    return colors.warning500;
            }
        };

        return (
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: getHeaderColor() }]} />
                <Text variant="sectionHeader">{section.title}</Text>
                <Text variant="meta" color="textSecondary" style={styles.sectionCount}>
                    {section.data.length}
                </Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: Purchase }) => (
        <View style={styles.itemContainer}>
            <ItemCard
                purchase={item}
                onPress={() => handleItemPress(item)}
                urgencyTier="urgent"
            />
        </View>
    );

    const renderEmpty = () => (
        <EmptyState
            title="All clear"
            message="No items require attention right now."
        />
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="screenTitle">Action Today</Text>
                {totalCount > 0 && (
                    <View style={styles.badge}>
                        <Text variant="meta" color="textInverse">{totalCount}</Text>
                    </View>
                )}
            </View>

            {totalCount === 0 ? (
                <View style={styles.emptyContainer}>
                    <Card style={styles.calmCard}>
                        <Text variant="sectionHeader" color="textSecondary" style={styles.calmTitle}>
                            All clear
                        </Text>
                        <Text variant="secondary" color="textTertiary" style={styles.calmMessage}>
                            No items require attention right now. Check back later.
                        </Text>
                    </Card>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    contentInsetAdjustmentBehavior="never"
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
                    }
                />
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
    },
    badge: {
        backgroundColor: colors.error500,
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginLeft: spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    sectionIndicator: {
        width: 3,
        height: 16,
        borderRadius: 2,
        marginRight: spacing.sm,
    },
    sectionCount: {
        marginLeft: spacing.sm,
    },
    listContent: {
        paddingBottom: 100, // Tab bar clearance
    },
    itemContainer: {
        marginBottom: spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: spacing.xxl,
    },
    calmCard: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    calmTitle: {
        marginBottom: spacing.xs,
    },
    calmMessage: {
        textAlign: 'center',
    },
});
