/**
 * TabNavigator
 * Main app navigation with 4 tabs
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { SettingsStack } from './SettingsStack';
import { ActionTodayScreen, AddItemScreen } from '../screens';
import { colors, spacing, typography, radius } from '../design';

export type TabParamList = {
    HomeTab: undefined;
    ActionToday: undefined;
    Add: undefined;
    SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Simple icon components (placeholder - will use proper icons later)
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const iconMap: Record<string, string> = {
        HomeTab: focused ? '⬤' : '○',
        ActionToday: focused ? '⬤' : '○',
        Add: '+',
        SettingsTab: focused ? '⬤' : '○',
    };

    return (
        <View style={[styles.iconContainer, name === 'Add' && styles.addIconContainer]}>
            <View style={styles.icon}>
                <View
                    style={{
                        width: name === 'Add' ? 24 : 8,
                        height: name === 'Add' ? 24 : 8,
                        backgroundColor: focused ? colors.primary600 : colors.gray400,
                        borderRadius: name === 'Add' ? 4 : 4,
                    }}
                />
            </View>
        </View>
    );
}

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary600,
                tabBarInactiveTintColor: colors.gray400,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Purchases',
                    tabBarIcon: ({ focused }) => <TabIcon name="HomeTab" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="ActionToday"
                component={ActionTodayScreen}
                options={{
                    title: 'Action',
                    tabBarIcon: ({ focused }) => <TabIcon name="ActionToday" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Add"
                component={AddItemScreen}
                options={{
                    title: 'Add',
                    tabBarIcon: ({ focused }) => <TabIcon name="Add" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsStack}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => <TabIcon name="SettingsTab" focused={focused} />,
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
        paddingTop: spacing.xs,
        height: 80,
    },
    tabLabel: {
        ...typography.meta,
        marginTop: spacing.xs,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
    },
    addIconContainer: {
        backgroundColor: colors.primary600,
        borderRadius: radius.md,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
