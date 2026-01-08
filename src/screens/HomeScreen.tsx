/**
 * HomeScreen
 * Main purchases list with urgency-first information hierarchy
 *
 * HIERARCHY SPEC:
 * 1. URGENT section (top 20%): Overdue, returns due <= 3 days, warranty <= 7 days
 * 2. UPCOMING section: Returns 4-14 days, warranty 8-30 days
 * 3. REFERENCE: Hidden by default (accessible via filter)
 *
 * When no urgent items: Show calm "Nothing urgent" state
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Card } from '../components/primitives';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { ItemCard } from '../components/ItemCard';
import { EmptyState } from '../components/EmptyState';
import { usePurchases, useSearchPurchases } from '../hooks/usePurchases';
import { Purchase, PurchaseStatus } from '../types';
import { HomeStackParamList } from '../navigation/HomeStack';
import { colors, spacing } from '../design';
import {
    groupByUrgency,
    sortByUrgency,
    UrgencyTier,
    hasUrgentItems,
    countUrgent,
} from '../utils/urgency';

type FilterValue = PurchaseStatus | 'all';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface Section {
    title: string;
    tier: UrgencyTier | 'empty';
    data: Purchase[];
}

/**
 * Section header component with visual differentiation by urgency
 */
function SectionHeader({ section }: { section: Section }) {
    if (section.tier === 'empty') {
        return null;
    }

    const getIndicatorColor = () => {
        switch (section.tier) {
            case 'urgent':
                return colors.error500;
            case 'upcoming':
                return colors.warning500;
            case 'reference':
                return colors.gray400;
        }
    };

    const getTitleOpacity = () => {
        switch (section.tier) {
            case 'urgent':
                return 1;
            case 'upcoming':
                return 0.85;
            case 'reference':
                return 0.6;
        }
    };

    return (
        <View style={styles.sectionHeader}>
            <View style={[styles.sectionIndicator, { backgroundColor: getIndicatorColor() }]} />
            <Text
                variant="sectionHeader"
                style={{ opacity: getTitleOpacity() }}
            >
                {section.title}
            </Text>
            <Text variant="meta" color="textSecondary" style={styles.sectionCount}>
                {section.data.length}
            </Text>
        </View>
    );
}

/**
 * Calm state when no urgent items exist
 */
function NothingUrgentState() {
    return (
        <Card style={styles.calmCard}>
            <Text variant="sectionHeader" color="textSecondary" style={styles.calmTitle}>
                Nothing urgent
            </Text>
            <Text variant="secondary" color="textTertiary" style={styles.calmMessage}>
                All deadlines are under control. Check back later or scroll to see upcoming items.
            </Text>
        </Card>
    );
}

export function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [filter, setFilter] = useState<FilterValue>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const statusFilter = filter === 'all' ? undefined : filter;
    const { purchases, isLoading, refresh } = usePurchases({ status: statusFilter });
    const { results: searchResults, search, clear: clearSearch } = useSearchPurchases();

    // Refresh on screen focus
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            search(query);
        } else {
            clearSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        clearSearch();
    };

    const handleItemPress = (purchase: Purchase) => {
        navigation.navigate('ItemDetail', { itemId: purchase.id });
    };

    // Determine display data
    const displayPurchases = searchQuery.trim() ? searchResults : purchases;

    // Group purchases by urgency tier
    const groupedPurchases = useMemo(() => {
        return groupByUrgency(displayPurchases);
    }, [displayPurchases]);

    // Build sections for SectionList
    const sections = useMemo((): Section[] => {
        const result: Section[] = [];

        // Always show urgent section content (or calm state)
        if (groupedPurchases.urgent.length > 0) {
            result.push({
                title: 'Requires Attention',
                tier: 'urgent',
                data: groupedPurchases.urgent,
            });
        }

        // Show upcoming if exists
        if (groupedPurchases.upcoming.length > 0) {
            result.push({
                title: 'Upcoming',
                tier: 'upcoming',
                data: groupedPurchases.upcoming,
            });
        }

        // Show reference only if filter is 'all' or 'archived'
        // Reference items are de-emphasized - shown last and with reduced weight
        if (groupedPurchases.reference.length > 0 && filter !== 'active') {
            result.push({
                title: 'No Deadline',
                tier: 'reference',
                data: groupedPurchases.reference,
            });
        }

        return result;
    }, [groupedPurchases, filter]);

    const urgentCount = countUrgent(displayPurchases);
    const hasUrgent = urgentCount > 0;

    const renderSectionHeader = ({ section }: { section: Section }) => (
        <SectionHeader section={section} />
    );

    const renderItem = ({ item, section }: { item: Purchase; section: Section }) => (
        <View style={[
            styles.itemContainer,
            section.tier === 'reference' && styles.itemContainerReference,
        ]}>
            <ItemCard
                purchase={item}
                onPress={() => handleItemPress(item)}
                urgencyTier={section.tier === 'empty' ? 'reference' : section.tier}
            />
        </View>
    );

    const renderListHeader = () => (
        <>
            <View style={styles.header}>
                <Text variant="screenTitle">Purchases</Text>
                {hasUrgent && (
                    <View style={styles.urgentBadge}>
                        <Text variant="meta" color="textInverse">
                            {urgentCount} urgent
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Search purchases..."
                    onClear={handleClearSearch}
                />
            </View>

            <View style={styles.filterContainer}>
                <FilterChips value={filter} onChange={setFilter} />
            </View>

            {/* Show calm state when no urgent items */}
            {!hasUrgent && displayPurchases.length > 0 && !searchQuery.trim() && (
                <NothingUrgentState />
            )}
        </>
    );

    const renderEmpty = () => {
        if (searchQuery.trim()) {
            return (
                <EmptyState
                    title="No results"
                    message="No purchases match your search."
                />
            );
        }

        return (
            <EmptyState
                title="No purchases yet"
                message="Add your first purchase to start tracking return windows and warranties."
            />
        );
    };

    return (
        <ScreenContainer>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={renderListHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refresh} />
                }
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    urgentBadge: {
        backgroundColor: colors.error500,
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginLeft: spacing.sm,
    },
    searchContainer: {
        marginBottom: spacing.md,
    },
    filterContainer: {
        marginBottom: spacing.lg,
    },
    listContent: {
        paddingBottom: spacing.xxxl,
        flexGrow: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingTop: spacing.lg,
    },
    sectionIndicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: spacing.sm,
    },
    sectionCount: {
        marginLeft: spacing.sm,
    },
    itemContainer: {
        marginBottom: spacing.md,
    },
    itemContainerReference: {
        opacity: 0.7,
    },
    calmCard: {
        marginBottom: spacing.lg,
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    calmTitle: {
        marginBottom: spacing.xs,
    },
    calmMessage: {
        textAlign: 'center',
    },
});
