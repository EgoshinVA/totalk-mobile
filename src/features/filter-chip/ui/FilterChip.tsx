import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { colors, borderRadius, typography, spacing } from '@/shared/styles';

interface FilterChipProps {
    label: string;
    active: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress, style }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={[styles.chip, active && styles.chipActive, style]}
    >
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: 'transparent',
        borderColor: colors.accent,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
        color: colors.textMuted,
    },
    labelActive: {
        color: colors.accent,
    },
});