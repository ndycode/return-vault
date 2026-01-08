/**
 * Divider Primitive
 * Horizontal separator line
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, spacing } from '../../design';

export interface DividerProps extends ViewProps {
    /** Vertical margin */
    spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function Divider({ spacing: spacingProp = 'md', style, ...props }: DividerProps) {
    const marginValue = spacingProp === 'none' ? 0 : spacing[spacingProp];

    return (
        <View
            style={[
                styles.divider,
                { marginVertical: marginValue },
                style,
            ]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
});
