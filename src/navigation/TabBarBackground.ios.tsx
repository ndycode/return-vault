/**
 * TabBarBackground (iOS)
 * Blur background for bottom tab bar with system material tint
 */

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabBarBackground() {
    return (
        <BlurView
            tint="systemChromeMaterial"
            intensity={100}
            style={StyleSheet.absoluteFill}
        />
    );
}

export function useBottomTabOverflow() {
    return useBottomTabBarHeight();
}
