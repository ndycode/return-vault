/**
 * AddItemScreen
 * Fast add flow for new purchases
 */

import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Input, Button, Card } from '../components/primitives';
import { PhotoCapture } from '../components/PhotoCapture';
import { ChipGroup } from '../components/ChipGroup';
import { DatePickerField } from '../components/DatePickerField';
import { useAddItem } from '../hooks/useAddItem';
import { colors, spacing, radius } from '../design';
import { useSettingsStore } from '../store/settingsStore';
import { FREE_ITEM_LIMIT } from '../types/pro';

type RootStackParamList = {
    Settings: undefined;
    Upgrade: undefined;
};

const RETURN_OPTIONS = [
    { label: 'None', value: null },
    { label: '14 days', value: 14 },
    { label: '30 days', value: 30 },
    { label: '60 days', value: 60 },
    { label: '90 days', value: 90 },
];

const WARRANTY_OPTIONS = [
    { label: 'None', value: null },
    { label: '3 mo', value: 3 },
    { label: '6 mo', value: 6 },
    { label: '12 mo', value: 12 },
    { label: '24 mo', value: 24 },
];

export function AddItemScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {
        state,
        updateField,
        handleCapturePhoto,
        handlePickPhoto,
        handleSave,
        dismissLimitModal,
    } = useAddItem();
    const isPro = useSettingsStore((s) => s.isPro);

    const handleUpgrade = () => {
        dismissLimitModal();
        navigation.navigate('Upgrade');
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text variant="h1">Add Purchase</Text>
                    {!isPro && state.remainingFree < FREE_ITEM_LIMIT && (
                        <Text variant="bodySmall" color="textSecondary">
                            {state.remainingFree} of {FREE_ITEM_LIMIT} free remaining
                        </Text>
                    )}
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <PhotoCapture
                        uri={state.photoUri}
                        onCapture={handleCapturePhoto}
                        onPick={handlePickPhoto}
                    />

                    <View style={styles.formGroup}>
                        <Input
                            label="Item name"
                            placeholder="e.g., Sony WH-1000XM5"
                            value={state.name}
                            onChangeText={(text) => updateField('name', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Input
                            label="Store (optional)"
                            placeholder="e.g., Best Buy, Amazon"
                            value={state.store}
                            onChangeText={(text) => updateField('store', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <DatePickerField
                            label="Purchase date"
                            value={state.purchaseDate}
                            onChange={(date) => updateField('purchaseDate', date)}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text variant="bodySmall" color="textSecondary" style={styles.label}>
                            Return window
                        </Text>
                        <ChipGroup
                            options={RETURN_OPTIONS}
                            value={state.returnWindowDays}
                            onChange={(value) => updateField('returnWindowDays', value)}
                            allowDeselect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text variant="bodySmall" color="textSecondary" style={styles.label}>
                            Warranty
                        </Text>
                        <ChipGroup
                            options={WARRANTY_OPTIONS}
                            value={state.warrantyMonths}
                            onChange={(value) => updateField('warrantyMonths', value)}
                            allowDeselect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Input
                            label="Price (optional)"
                            placeholder="0.00"
                            value={state.price}
                            onChangeText={(text) => updateField('price', text)}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Input
                            label="Serial number (optional)"
                            placeholder="Enter serial number"
                            value={state.serialNumber}
                            onChangeText={(text) => updateField('serialNumber', text)}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Input
                            label="Notes (optional)"
                            placeholder="Any additional notes"
                            value={state.notes}
                            onChangeText={(text) => updateField('notes', text)}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Save Purchase"
                        fullWidth
                        onPress={handleSave}
                        loading={state.isLoading}
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Purchase limit modal */}
            <Modal
                visible={state.showLimitModal}
                transparent
                animationType="fade"
                onRequestClose={dismissLimitModal}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalCard}>
                        <Text variant="h2" style={styles.modalTitle}>
                            Free Limit Reached
                        </Text>
                        <Text variant="body" color="textSecondary" style={styles.modalText}>
                            You've reached the limit of {FREE_ITEM_LIMIT} items on the free plan.
                            Upgrade to Pro for unlimited items and more features.
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button
                                title="Upgrade to Pro"
                                fullWidth
                                onPress={handleUpgrade}
                            />
                            <Pressable onPress={dismissLimitModal} style={styles.dismissButton}>
                                <Text variant="body" color="textSecondary">
                                    Maybe Later
                                </Text>
                            </Pressable>
                        </View>
                    </Card>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingVertical: spacing.lg,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: spacing.xl,
    },
    formGroup: {
        marginTop: spacing.lg,
    },
    label: {
        marginBottom: spacing.sm,
    },
    footer: {
        paddingVertical: spacing.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalCard: {
        width: '100%',
        maxWidth: 340,
        padding: spacing.xl,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    modalButtons: {
        gap: spacing.md,
    },
    dismissButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
});
