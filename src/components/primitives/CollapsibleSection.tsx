/**
 * CollapsibleSection Primitive
 * Universal disclosure pattern for progressive reveal
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../design';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleSectionProps {
    /** Section title */
    title: string;
    /** Initial expanded state */
    defaultExpanded?: boolean;
    /** Content to reveal */
    children: React.ReactNode;
    /** Trigger label when collapsed (e.g., "Show more", "Add details") */
    triggerLabel?: string;
    /** Hide header when expanded (for inline reveal patterns) */
    hideHeaderWhenExpanded?: boolean;
    /** Callback when state changes */
    onToggle?: (expanded: boolean) => void;
    /** Accessibility hint for the toggle button */
    accessibilityHint?: string;
}

export function CollapsibleSection({
    title,
    defaultExpanded = false,
    children,
    triggerLabel,
    hideHeaderWhenExpanded = false,
    onToggle,
    accessibilityHint,
}: CollapsibleSectionProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newState = !expanded;
        setExpanded(newState);
        onToggle?.(newState);
    };

    const displayLabel = expanded ? title : (triggerLabel || title);
    const showHeader = !(hideHeaderWhenExpanded && expanded);

    return (
        <View style={styles.container}>
            {showHeader && (
                <Pressable
                    onPress={handleToggle}
                    style={styles.header}
                    accessibilityRole="button"
                    accessibilityLabel={displayLabel}
                    accessibilityHint={accessibilityHint ?? (expanded ? 'Tap to collapse' : 'Tap to expand')}
                    accessibilityState={{ expanded }}
                >
                    <Text variant="label" color="primary600" style={styles.label}>
                        {displayLabel}
                    </Text>
                    <Text variant="label" color="textTertiary">
                        {expanded ? '▲' : '▼'}
                    </Text>
                </Pressable>
            )}
            {expanded && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // No margin - let parent control spacing
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    label: {
        flex: 1,
    },
    content: {
        // Content appears immediately below header
    },
});
