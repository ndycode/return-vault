/**
 * SettingsStack Navigator
 * Settings -> sub-screens navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens';
import { UpgradeScreen } from '../screens/UpgradeScreen';
import { colors } from '../design';

export type SettingsStackParamList = {
    Settings: undefined;
    Upgrade: undefined;
    Backup: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Upgrade" component={UpgradeScreen} />
        </Stack.Navigator>
    );
}
