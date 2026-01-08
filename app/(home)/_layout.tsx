/**
 * Home Tab Stack Layout
 * Enables navigation: index (Home) → [itemId] (ItemDetail)
 */

import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[itemId]" />
        </Stack>
    );
}
