/**
 * DatePickerField Component
 * Date input with native picker
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';
import { formatDisplayDate } from '../utils/dateUtils';
import { parseISO } from 'date-fns';

interface DatePickerFieldProps {
    label?: string;
    value: string; // ISO date string
    onChange: (date: string) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
    const [showPicker, setShowPicker] = useState(false);
    const dateValue = parseISO(value);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (event.type === 'set' && selectedDate) {
            const isoDate = selectedDate.toISOString().split('T')[0];
            onChange(isoDate);
        }

        if (Platform.OS === 'ios' && event.type === 'dismissed') {
            setShowPicker(false);
        }
    };

    const handleConfirmIOS = () => {
        setShowPicker(false);
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text variant="label" color="textSecondary" style={styles.label}>
                    {label}
                </Text>
            )}
            <Pressable onPress={() => setShowPicker(true)} style={styles.field}>
                <Text variant="body">{formatDisplayDate(value)}</Text>
            </Pressable>

            {showPicker && (
                <View>
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleChange}
                        maximumDate={new Date()}
                    />
                    {Platform.OS === 'ios' && (
                        <Pressable onPress={handleConfirmIOS} style={styles.doneButton}>
                            <Text variant="button" color="primary600">Done</Text>
                        </Pressable>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        marginBottom: spacing.xs,
    },
    field: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        minHeight: 48,
        justifyContent: 'center',
    },
    doneButton: {
        alignItems: 'flex-end',
        paddingVertical: spacing.sm,
    },
});
