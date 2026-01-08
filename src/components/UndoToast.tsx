/**
 * UndoToast Component
 * Time-bound undo notification for reversible actions
 * 
 * v1.06-B: Confirmation → Undo Strategy
 * - Replaces confirmation dialogs for non-destructive actions
 * - 5 second undo window
 * - Single tap to undo
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';
import { BEHAVIOR_RULES } from '../utils/defaults';

export interface UndoAction {
    id: string;
    message: string;
    onUndo: () => void;
}

interface UndoToastProps {
    action: UndoAction | null;
    onDismiss: () => void;
}

export function UndoToast({ action, onDismiss }: UndoToastProps) {
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (!action) {
            // Hide animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            return;
        }

        // Reset and show
        setTimeLeft(5);
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();

        // Countdown timer
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onDismiss();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-dismiss after undo window
        const timeout = setTimeout(() => {
            onDismiss();
        }, BEHAVIOR_RULES.undoWindowMs);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [action, onDismiss, translateY, opacity]);

    if (!action) {
        return null;
    }

    const handleUndo = () => {
        action.onUndo();
        onDismiss();
    };

    return (
        <Animated.View 
            style={[
                styles.container, 
                { 
                    transform: [{ translateY }],
                    opacity,
                }
            ]}
        >
            <View style={styles.content}>
                <Text variant="body" color="textInverse" style={styles.message}>
                    {action.message}
                </Text>
                <Pressable onPress={handleUndo} style={styles.undoButton}>
                    <Text variant="label" color="primary200" style={styles.undoText}>
                        UNDO ({timeLeft}s)
                    </Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: spacing.md,
        right: spacing.md,
        zIndex: 1000,
    },
    content: {
        backgroundColor: colors.gray800,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    message: {
        flex: 1,
        marginRight: spacing.md,
    },
    undoButton: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    undoText: {
        // fontWeight: '600', // Handled by label variant
    },
});
