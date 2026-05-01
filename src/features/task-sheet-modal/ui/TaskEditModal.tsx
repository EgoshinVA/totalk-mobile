import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, Modal, Platform, Pressable,
    StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/styles';
import { Task } from '@/entities/tasks/model/types';
import { X } from 'lucide-react-native';

interface TaskEditModalProps {
    isVisible: boolean;
    task: Task | null;
    onClose: () => void;
    onSave?: (updatedTask: Partial<Task>) => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ isVisible, task, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
        }
    }, [task]);

    if (!task) return null;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"  // slide лучше для мобилки
            onRequestClose={onClose}
        >
            {/* KeyboardAvoidingView — снаружи overlay */}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
            >
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                        <View style={styles.handle} />

                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>Edit Task</Text>
                            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <X size={22} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.titleInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="What needs to be done?"
                            placeholderTextColor={colors.textMuted}
                            returnKeyType="next"
                        />

                        <TextInput
                            style={styles.descInput}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Add notes..."
                            placeholderTextColor={colors.textMuted}
                            multiline
                            textAlignVertical="top"
                            scrollEnabled
                        />

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={() => {
                                onSave?.({ ...task, title, description });
                                onClose();
                            }}
                        >
                            <Text style={styles.saveBtnText}>Save</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end', // Снизу как bottom sheet
    },
    handle: {
        width: 36, height: 4,
        backgroundColor: colors.borderColor,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.md,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    titleInput: {
        fontSize: typography.sizes.md,
        color: colors.textPrimary,
        backgroundColor: colors.surfaceElevated,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    descInput: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        backgroundColor: colors.surfaceElevated,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        height: 120,
        marginBottom: spacing.lg,
    },
    saveBtn: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: typography.sizes.md,
    },
});