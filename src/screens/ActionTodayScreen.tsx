/**
 * ActionTodayScreen
 * Items with deadlines due soon or overdue
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Card } from '../components/primitives';
import { ItemCard } from '../components/ItemCard';
import { EmptyState } from '../components/EmptyState';
import { useActionItems } from '../hooks/useActionItems';
import { Purchase } from '../types';
import { HomeStackParamList } from '../navigation/HomeStack';
import { colors, spacing } from '../design';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface Section {
    title: string;
    type: 'overdue' | 'return' | 'warranty';
    data: Purchase[];
}

export function ActionTodayScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { overdue, returnDueSoon, warrantyExpiringSoon, isLoading, refresh, totalCount } = useActionItems();

    // Refresh on screen focus
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const handleItemPress = (purchase: Purchase) => {
        navigation.navigate('ItemDetail', { itemId: purchase.id });
    };

    // Build sections
    const sections: Section[] = [];

    if (overdue.length > 0) {
        sections.push({
            title: 'Overdue',
            type: 'overdue',
            data: overdue,
        });
    }

    if (returnDueSoon.length > 0) {
        sections.push({
            title: 'Return Due Soon',
            type: 'return',
            data: returnDueSoon,
        });
    }

    if (warrantyExpiringSoon.length > 0) {
        sections.push({
            title: 'Warranty Expiring',
            type: 'warranty',
            data: warrantyExpiringSoon,
        });
    }

    const renderSectionHeader = ({ section }: { section: Section }) => {
        const getHeaderColor = () => {
            switch (section.type) {
                case 'overdue':
                    return colors.error500;
                case 'return':
                    return colors.warning500;
                case 'warranty':
                    return colors.primary500;
            }
        };

        return (
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: getHeaderColor() }]} />
                <Text variant="h3">{section.title}</Text>
                <Text variant="bodySmall" color="textSecondary" style={styles.sectionCount}>
                    {section.data.length}
                </Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: Purchase }) => (
        <View style={styles.itemContainer}>
            <ItemCard purchase={item} onPress={() => handleItemPress(item)} />
        </View>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="h1">Action Today</Text>
                {totalCount > 0 && (
                    <View style={styles.badge}>
                        <Text variant="caption" color="textInverse">{totalCount}</Text>
                    </View>
                )}
            </View>

            {totalCount === 0 ? (
                <EmptyState
                    title="All clear"
                    message="No items require attention right now. You're on top of things."
                />
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
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
        paddingVertical: spacing.md,
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
    listContent: {
        paddingBottom: spacing.xxxl,
    },
    itemContainer: {
        marginBottom: spacing.md,
    },
});
