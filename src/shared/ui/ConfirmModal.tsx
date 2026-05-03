import React from 'react';
import {
    Modal, Pressable, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import {borderRadius, colors, spacing, typography} from '@/shared/styles';

interface Action {
    label: string;
    onPress: () => void;
    destructive?: boolean;
}

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message?: string;
    actions: Action[];
    onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              visible, title, message, actions, onClose,
                                                          }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
            <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
                <Text style={styles.title}>{title}</Text>
                {message && <Text style={styles.message}>{message}</Text>}

                <View style={styles.actions}>
                    {actions.map((action, i) => (
                        <React.Fragment key={action.label}>
                            {i > 0 && <View style={styles.divider}/>}
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => {
                                    action.onPress();
                                    onClose();
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.actionLabel,
                                    action.destructive && styles.actionDestructive,
                                ]}>
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>

                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.cancelLabel}>Cancel</Text>
                </TouchableOpacity>
            </Pressable>
        </Pressable>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
    },
    sheet: {
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
        gap: spacing.md,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    message: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: typography.sizes.sm * 1.5,
    },
    actions: {
        backgroundColor: colors.surfaceDark,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginTop: spacing.sm,
    },
    actionBtn: {
        paddingVertical: spacing.md + 2,
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: typography.sizes.md,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    actionDestructive: {
        color: '#E05252',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.background,
        marginHorizontal: spacing.md,
    },
    cancelBtn: {
        backgroundColor: colors.surfaceDark,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md + 2,
        alignItems: 'center',
    },
    cancelLabel: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});