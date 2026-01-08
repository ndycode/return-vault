/**
 * ScreenContainer Primitive
 * Safe area wrapper with consistent 8pt grid padding
 */

import React from 'react';
import { View, StyleSheet, ViewProps, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../design';

export interface ScreenContainerProps extends ViewProps {
    /** Apply horizontal padding (default: 16px) */
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
                    paddingLeft: padded ? spacing.md : 0,
                    paddingRight: padded ? spacing.md : 0,
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
