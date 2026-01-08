/**
 * DatePickerField Component
 * Compact inline date picker with native iOS styling
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from './primitives';
import { colors, spacing, radius } from '../design';
import { parseISO } from 'date-fns';

interface DatePickerFieldProps {
    label?: string;
    value: string; // ISO date string
    onChange: (date: string) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
    const dateValue = parseISO(value);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            const isoDate = selectedDate.toISOString().split('T')[0];
            onChange(isoDate);
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text variant="label" color="textSecondary" style={styles.label}>
                    {label}
                </Text>
            )}
            <View style={styles.pickerWrapper}>
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={handleChange}
                    maximumDate={new Date()}
                    style={styles.picker}
                    accentColor={colors.primary600}
                />
            </View>
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
    pickerWrapper: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    picker: {
        marginLeft: -8, // Offset iOS native picker padding
    },
});
