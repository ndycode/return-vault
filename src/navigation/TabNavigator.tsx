/**
 * TabNavigator
 * Main app navigation with 4 tabs
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { SettingsStack } from './SettingsStack';
import { ActionTodayScreen, AddItemScreen } from '../screens';
import { IconSymbol, type IconSymbolName } from '../components/primitives';
import { colors, spacing, typography } from '../design';
import { HapticTab } from './HapticTab';
import TabBarBackground from './TabBarBackground';

export type TabParamList = {
    HomeTab: undefined;
    ActionToday: undefined;
    Add: undefined;
    SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, IconSymbolName> = {
    HomeTab: 'house.fill',
    ActionToday: 'bell.fill',
    Add: 'plus.circle.fill',
    SettingsTab: 'gearshape',
};

function TabIcon({ name, color, size }: { name: keyof TabParamList; color: string; size: number }) {
    return <IconSymbol name={TAB_ICONS[name]} color={color} size={size} />;
}

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    Platform.OS === 'ios' && styles.tabBarBlur,
                ],
                tabBarActiveTintColor: colors.primary600,
                tabBarInactiveTintColor: colors.gray400,
                tabBarLabelStyle: styles.tabLabel,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarItemStyle: styles.tabItem,
                tabBarIconStyle: styles.tabIcon,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Purchases',
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon name="HomeTab" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="ActionToday"
                component={ActionTodayScreen}
                options={{
                    title: 'Action',
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon name="ActionToday" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Add"
                component={AddItemScreen}
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon name="Add" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsStack}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon name="SettingsTab" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        borderTopWidth: StyleSheet.hairlineWidth,
        height: Platform.select({ ios: 49, android: 56 }),
        paddingTop: spacing.xs,
        paddingBottom: Platform.OS === 'ios' ? spacing.xs : 0,
    },
    tabBarBlur: {
        backgroundColor: colors.surfaceTransparent,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500' as const,
        lineHeight: 12,
        letterSpacing: 0,
        marginTop: spacing.xs,
    },
    tabItem: {
        paddingBottom: spacing.xs,
    },
    tabIcon: {
        marginBottom: spacing.xxs,
    },
});
