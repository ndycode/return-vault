/**
 * Modal Primitive
 * Reusable modal dialog with overlay and card styling
 */

import React from 'react';
import { Modal as RNModal, View, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../design';
import { Text } from './Text';
import { Button } from './Button';
import { Card } from './Card';

export interface ModalAction {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Called when modal is dismissed */
    onClose: () => void;
    /** Modal title */
    title: string;
    /** Modal message/description */
    message?: string;
    /** Primary action button */
    primaryAction?: ModalAction;
    /** Secondary action (typically dismiss/cancel) */
    secondaryAction?: ModalAction;
    /** Optional children for custom content */
    children?: React.ReactNode;
}

export function Modal({
    visible,
    onClose,
    title,
    message,
    primaryAction,
    secondaryAction,
    children,
}: ModalProps) {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <Card style={styles.card}>
                    <Text variant="sectionHeader" style={styles.title}>
                        {title}
                    </Text>
                    {message && (
                        <Text variant="body" color="textSecondary" style={styles.message}>
                            {message}
                        </Text>
                    )}
                    {children}
                    <View style={styles.buttons}>
                        {primaryAction && (
                            <Button
                                title={primaryAction.label}
                                variant={primaryAction.variant ?? 'primary'}
                                fullWidth
                                onPress={primaryAction.onPress}
                            />
                        )}
                        {secondaryAction && (
                            <Pressable 
                                onPress={secondaryAction.onPress} 
                                style={styles.secondaryButton}
                            >
                                <Text variant="body" color="textSecondary">
                                    {secondaryAction.label}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </Card>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    card: {
        width: '100%',
        maxWidth: 320,
        padding: spacing.lg,
        borderRadius: radius.lg,
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    buttons: {
        gap: spacing.sm,
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
});
