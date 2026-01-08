/**
 * Root Layout - Native Tabs
 * Provides iOS liquid glass tab bar with 4 tabs
 */

import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function RootLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="(home)">
                <Label>Purchases</Label>
                <Icon sf={{ default: "house", selected: "house.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="action">
                <Label>Action</Label>
                <Icon sf={{ default: "bell", selected: "bell.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="add">
                <Label>Add</Label>
                <Icon sf={{ default: "plus.circle", selected: "plus.circle.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(settings)">
                <Label>Settings</Label>
                <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
