/**
 * ScreenContainer Primitive
 * Safe area wrapper with consistent padding
 * 
 * SPACING:
 * - Horizontal padding: xl (24px)
 * - Respects safe area insets
 */

import React from 'react';
import { View, StyleSheet, ViewProps, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../design';

export interface ScreenContainerProps extends ViewProps {
    /** Apply horizontal padding (default: 24px) */
    padded?: boolean;
    /** Background color override */
    backgroundColor?: string;
    /** Children */
    children: React.ReactNode;
}

export function ScreenContainer({
    padded = true,
    backgroundColor = colors.background,
    style,
    children,
    ...props
}: ScreenContainerProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: padded ? spacing.xl : 0, // 24px
                    paddingRight: padded ? spacing.xl : 0, // 24px
                },
                style,
            ]}
            {...props}
        >
            <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
