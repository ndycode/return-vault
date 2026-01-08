/**
 * HomeScreen
 * Main purchases list with search and filters
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text } from '../components/primitives';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { ItemCard } from '../components/ItemCard';
import { EmptyState } from '../components/EmptyState';
import { usePurchases, useSearchPurchases } from '../hooks/usePurchases';
import { Purchase, PurchaseStatus } from '../types';
import { HomeStackParamList } from '../navigation/HomeStack';
import { spacing } from '../design';

type FilterValue = PurchaseStatus | 'all';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

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

    const displayPurchases = searchQuery.trim() ? searchResults : purchases;

    const renderItem = ({ item }: { item: Purchase }) => (
        <View style={styles.itemContainer}>
            <ItemCard purchase={item} onPress={() => handleItemPress(item)} />
        </View>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="h1">Purchases</Text>
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

            <FlatList
                data={displayPurchases}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refresh} />
                }
                ListEmptyComponent={
                    <EmptyState
                        title="No purchases yet"
                        message="Add your first purchase to start tracking return windows and warranties."
                    />
                }
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
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
    itemContainer: {
        marginBottom: spacing.md,
    },
});
