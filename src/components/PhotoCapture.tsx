/**
 * PhotoCapture Component
 * Camera/gallery photo capture with preview
 * 
 * v1.06-B: Zero-Thinking Defaults
 * - Removed "Are you sure?" confirmation for photo removal
 * - User can simply re-add a photo if removed accidentally
 * - Reduces friction in photo-first flow
 */

import React from 'react';
import { View, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';

interface PhotoCaptureProps {
    uri: string | null;
    onCapture: () => void;
    onPick: () => void;
    onRemove?: () => void;
}

export function PhotoCapture({ uri, onCapture, onPick, onRemove }: PhotoCaptureProps) {
    const handlePress = () => {
        Alert.alert(
            'Add Photo',
            'Choose how to add a photo',
            [
                { text: 'Take Photo', onPress: onCapture },
                { text: 'Choose from Library', onPress: onPick },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    /**
     * v1.06-B: Direct removal without confirmation
     * Long-press removes photo immediately - user can tap to re-add
     */
    const handleLongPress = () => {
        if (uri && onRemove) {
            onRemove();
        }
    };

    if (uri) {
        return (
            <Pressable
                onPress={handlePress}
                onLongPress={handleLongPress}
                style={styles.container}
            >
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                <View style={styles.overlay}>
                    <Text variant="meta" color="textInverse">
                        Tap to change
                    </Text>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable onPress={handlePress} style={styles.placeholder}>
            <View style={styles.iconContainer}>
                <View style={styles.cameraIcon} />
            </View>
            <Text variant="body" color="textSecondary" style={styles.text}>
                Add receipt photo
            </Text>
            <Text variant="meta" color="textTertiary">
                Tap to take photo or choose from library
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: colors.gray100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    placeholder: {
        height: 200,
        backgroundColor: colors.gray50,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.gray300,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        backgroundColor: colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cameraIcon: {
        width: 24,
        height: 24,
        backgroundColor: colors.gray400,
        borderRadius: 4,
    },
    text: {
        marginBottom: spacing.xs,
    },
});
