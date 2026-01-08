/**
 * ListRow Primitive
 * Standard settings/list row with optional accessories
 */

import React from 'react';
import { View, StyleSheet, Pressable, ViewProps } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

export interface ListRowProps extends ViewProps {
    /** Primary label */
    label: string;
    /** Secondary value text */
    value?: string;
    /** Right accessory element (switch, badge, etc.) */
    rightElement?: React.ReactNode;
    /** Press handler */
    onPress?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Show chevron indicator */
    showChevron?: boolean;
}

export function ListRow({
    label,
    value,
    rightElement,
    onPress,
    disabled = false,
    showChevron = false,
    style,
    ...props
}: ListRowProps) {
    const content = (
        <View style={[styles.container, disabled && styles.disabled, style]} {...props}>
            <Text
                variant="body"
                color={disabled ? 'textTertiary' : 'textPrimary'}
                style={styles.label}
            >
                {label}
            </Text>
            <View style={styles.right}>
                {value && (
                    <Text variant="body" color="textSecondary">
                        {value}
                    </Text>
                )}
                {rightElement}
                {showChevron && !rightElement && (
                    <View style={styles.chevron} />
                )}
            </View>
        </View>
    );

    if (onPress && !disabled) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => pressed && styles.pressed}
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg, // 16px
        minHeight: 48,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    label: {
        flex: 1,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    chevron: {
        width: 8,
        height: 8,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors.gray400,
        transform: [{ rotate: '-45deg' }],
        marginLeft: spacing.xs,
    },
});
