/**
 * AddItemScreen
 * Fast add flow for new purchases
 * 
 * v1.06-B: Zero-Thinking Defaults + Progressive Disclosure
 * - Only 4 essential fields visible by default (photo, name, date, return window)
 * - Store, Warranty, Price, Serial, Notes hidden under "Add more details"
 * - Smart store-based defaults (typing "Costco" → 90 day return, 24 mo warranty)
 * - No scrolling required for basic add
 * - Advanced fields preserve input on collapse
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
    ScreenContainer, Text, Input, Button, Card, CollapsibleSection,
    PhotoCapture, ChipGroup, DatePickerField
} from '../components';
import { useAddItem } from '../hooks/useAddItem';
import { colors, spacing } from '../design';
import { useSettingsStore } from '../store/settingsStore';
import { FREE_ITEM_LIMIT } from '../types/pro';


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
    const router = useRouter();
    const {
        state,
        updateField,
        handleStoreChange,
        handleCapturePhoto,
        handlePickPhoto,
        handleSave,
        dismissLimitModal,
    } = useAddItem();
    const isPro = useSettingsStore((s) => s.isPro);

    // Track if advanced fields section is expanded
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleUpgrade = () => {
        dismissLimitModal();
        router.push('/upgrade');
    };

    // Auto-expand if any advanced field has data (preserve on navigation)
    const hasAdvancedData = Boolean(
        state.store || state.warrantyMonths || state.price || state.serialNumber || state.notes
    );

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text variant="screenTitle">Add Purchase</Text>
                    {!isPro && state.remainingFree < FREE_ITEM_LIMIT && (
                        <Text variant="secondary" color="textSecondary">
                            {state.remainingFree} of {FREE_ITEM_LIMIT} free remaining
                        </Text>
                    )}
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    contentInsetAdjustmentBehavior="never"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ─────────────────────────────────────────────
                        ESSENTIAL FIELDS (Always visible - compact layout)
                        Required for minimum viable purchase entry
                    ───────────────────────────────────────────── */}

                    {/* 1. Photo capture - quick proof */}
                    <PhotoCapture
                        uri={state.photoUri}
                        onCapture={handleCapturePhoto}
                        onPick={handlePickPhoto}
                    />

                    {/* 2. Item name - required identifier */}
                    <View style={styles.formGroup}>
                        <Input
                            label="Item name"
                            placeholder="e.g., Sony WH-1000XM5"
                            value={state.name}
                            onChangeText={(text) => updateField('name', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* 3. Purchase date */}
                    <View style={styles.formGroup}>
                        <DatePickerField
                            label="Purchase date"
                            value={state.purchaseDate}
                            onChange={(date) => updateField('purchaseDate', date)}
                        />
                    </View>

                    {/* 4. Return window */}
                    <View style={styles.formGroup}>
                        <Text variant="label" color="textSecondary" style={styles.labelCompact}>
                            Return window
                        </Text>
                        <ChipGroup
                            options={RETURN_OPTIONS}
                            value={state.returnWindowDays}
                            onChange={(value) => updateField('returnWindowDays', value)}
                            allowDeselect={false}
                        />
                    </View>

                    {/* ─────────────────────────────────────────────
                        ADVANCED FIELDS (Hidden by default)
                        Low-frequency fields, not required for save
                    ───────────────────────────────────────────── */}
                    <View style={styles.advancedSection}>
                        <CollapsibleSection
                            title="Hide details"
                            triggerLabel="Add more details"
                            defaultExpanded={showAdvanced || hasAdvancedData}
                            onToggle={setShowAdvanced}
                        >
                            {/* Store - with smart defaults */}
                            <View style={styles.advancedField}>
                                <Input
                                    label="Store"
                                    placeholder="e.g., Best Buy, Amazon, Costco"
                                    value={state.store}
                                    onChangeText={handleStoreChange}
                                    autoCapitalize="words"
                                />
                                {state.storeDefaultsApplied && (
                                    <Text variant="meta" color="success500" style={styles.advancedHint}>
                                        Return & warranty updated for this store
                                    </Text>
                                )}
                            </View>

                            {/* Warranty */}
                            <View style={styles.advancedField}>
                                <Text variant="label" color="textSecondary" style={styles.labelCompact}>
                                    Warranty
                                </Text>
                                <ChipGroup
                                    options={WARRANTY_OPTIONS}
                                    value={state.warrantyMonths}
                                    onChange={(value) => updateField('warrantyMonths', value)}
                                    allowDeselect={false}
                                />
                            </View>

                            {/* Price */}
                            <View style={styles.advancedField}>
                                <Input
                                    label="Price"
                                    placeholder="0.00"
                                    value={state.price}
                                    onChangeText={(text) => updateField('price', text)}
                                    keyboardType="decimal-pad"
                                />
                            </View>

                            {/* Serial number */}
                            <View style={styles.advancedField}>
                                <Input
                                    label="Serial number"
                                    placeholder="Enter serial number"
                                    value={state.serialNumber}
                                    onChangeText={(text) => updateField('serialNumber', text)}
                                    autoCapitalize="characters"
                                />
                            </View>

                            {/* Notes */}
                            <View style={styles.advancedField}>
                                <Input
                                    label="Notes"
                                    placeholder="Any additional notes"
                                    value={state.notes}
                                    onChangeText={(text) => updateField('notes', text)}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>
                        </CollapsibleSection>
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
                        <Text variant="sectionHeader" style={styles.modalTitle}>
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
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100, // Extra space for footer + tab bar
    },
    formGroup: {
        marginTop: spacing.sm, // Compact spacing
    },
    twoColumnRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    columnHalf: {
        flex: 1,
    },
    label: {
        marginBottom: spacing.sm,
    },
    labelCompact: {
        marginBottom: spacing.xs,
    },
    advancedSection: {
        marginTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.xs,
    },
    advancedField: {
        marginTop: spacing.md,
    },
    advancedHint: {
        marginTop: spacing.xs,
    },
    footer: {
        paddingTop: spacing.md,
        paddingBottom: 60, // Tab bar clearance
        backgroundColor: colors.background,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    modalCard: {
        width: '100%',
        maxWidth: 320,
        padding: spacing.lg,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalButtons: {
        gap: spacing.sm,
    },
    dismissButton: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
});
