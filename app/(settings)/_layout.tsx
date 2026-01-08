/**
 * Settings Tab Stack Layout
 * Enables navigation: index (Settings) → upgrade
 */

import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="upgrade" />
        </Stack>
    );
}
