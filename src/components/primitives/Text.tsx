/**
 * Text Primitive
 * Typography-aware text component
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography, TypographyToken, ColorToken } from '../../design';

export interface TextProps extends Omit<RNTextProps, 'style'> {
    /** Typography variant */
    variant?: TypographyToken;
    /** Text color token */
    color?: ColorToken;
    /** Center align text */
    center?: boolean;
    /** Additional style overrides (discouraged) */
    style?: RNTextProps['style'];
}

export function Text({
    variant = 'body',
    color = 'textPrimary',
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
