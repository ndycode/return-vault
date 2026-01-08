/**
 * HomeStack Navigator
 * Home → ItemDetail navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ItemDetailScreen } from '../screens';
import { colors } from '../design';

export type HomeStackParamList = {
    Home: undefined;
    ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
                name="ItemDetail"
                component={ItemDetailScreen}
                options={{
                    presentation: 'card',
                }}
            />
        </Stack.Navigator>
    );
}
