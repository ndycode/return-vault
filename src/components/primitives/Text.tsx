/**
 * Text Primitive
 * Typography-aware text component with weight override support
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, typography, TypographyToken, ColorToken } from '../../design';

type FontWeight = TextStyle['fontWeight'];

export interface TextProps extends Omit<RNTextProps, 'style'> {
    /** Typography variant */
    variant?: TypographyToken;
    /** Text color token */
    color?: ColorToken;
    /** Override font weight (use sparingly) */
    weight?: FontWeight;
    /** Center align text */
    center?: boolean;
    /** Additional style overrides (discouraged) */
    style?: RNTextProps['style'];
}

export function Text({
    variant = 'body',
    color = 'textPrimary',
    weight,
    center = false,
    style,
    children,
    ...props
}: TextProps) {
    return (
        <RNText
            style={[
                typography[variant],
                { color: colors[color] },
                weight !== undefined && { fontWeight: weight },
                center && styles.center,
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
    },
});
