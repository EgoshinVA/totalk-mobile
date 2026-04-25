import React, { useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Animated, PanResponder, Dimensions,
} from 'react-native';
import { Clock, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/shared/styles';
import { Task } from '@/entities/tasks/model/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -80; // свайп влево на 80px открывает кнопку удаления

interface TaskCardProps {
    task: Task;
    onToggle?: (task: Task) => void;
    onPress?: (task: Task) => void;
    onDelete?: (task: Task) => void;
}

function formatSchedule(iso?: string | null): string {
    if (!iso) return '';
    const date = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const taskDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (taskDay.getTime() === today.getTime()) return `Today, ${time}`;
    if (taskDay.getTime() === tomorrow.getTime()) return `Tomorrow, ${time}`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${time}`;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onPress, onDelete }) => {
    const isDone = task.status === 'done';
    const isCanceled = task.status === 'canceled';
    const isInactive = isDone || isCanceled;

    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 15,
            onPanResponderMove: (_, g) => {
                const val = isOpen.current ? g.dx - 72 : g.dx;
                translateX.setValue(Math.max(-72, Math.min(0, val)));
            },
            onPanResponderRelease: (_, g) => {
                const shouldOpen = isOpen.current ? g.dx > -20 : g.dx < SWIPE_THRESHOLD;
                if (shouldOpen && !isOpen.current) {
                    Animated.spring(translateX, { toValue: -72, useNativeDriver: true }).start();
                    isOpen.current = true;
                } else if (!shouldOpen || isOpen.current) {
                    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
                    isOpen.current = false;
                }
            },
        })
    ).current;

    const closeSwipe = () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        isOpen.current = false;
    };

    return (
        <View style={styles.wrapper}>
            {/* Кнопка удаления за карточкой */}
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => { closeSwipe(); onDelete?.(task); }}
            >
                <Trash2 size={20} color="#fff" />
            </TouchableOpacity>

            <Animated.View
                style={{ transform: [{ translateX }] }}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity
                    style={[styles.card, isInactive && styles.cardDone]}
                    onPress={() => { if (isOpen.current) { closeSwipe(); return; } onPress?.(task); }}
                    activeOpacity={0.75}
                >
                    <TouchableOpacity
                        style={[styles.checkbox, isDone && styles.checkboxDone]}
                        onPress={() => onToggle?.(task)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {isDone && <CheckCircle size={20} color={colors.accent} />}
                        {isCanceled && <XCircle size={18} color={colors.textMuted} />}
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={[styles.title, isInactive && styles.titleDone]} numberOfLines={2}>
                            {task.title}
                        </Text>
                        {task.description ? (
                            <Text style={styles.description} numberOfLines={1}>
                                {task.description}
                            </Text>
                        ) : null}
                        <View style={styles.meta}>
                            {isDone ? (
                                <>
                                    <CheckCircle size={12} color={colors.accent} />
                                    <Text style={[styles.metaText, { color: colors.accent }]}>Completed</Text>
                                </>
                            ) : isCanceled ? (
                                <>
                                    <XCircle size={12} color={colors.textMuted} />
                                    <Text style={styles.metaText}>Canceled</Text>
                                </>
                            ) : task.scheduledAt ? (
                                <>
                                    <Clock size={12} color={colors.textMuted} />
                                    <Text style={styles.metaText}>{formatSchedule(task.scheduledAt)}</Text>
                                </>
                            ) : null}
                            {task.isRecurring && (
                                <View style={styles.recurringBadge}>
                                    <RefreshCw size={10} color={colors.accent} />
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    deleteBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 72,
        backgroundColor: '#E53935',
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.recordColor,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.borderColor,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.md,
    },
    cardDone: { opacity: 0.7 },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.textMuted,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    checkboxDone: { borderColor: 'transparent' },
    content: { flex: 1, gap: 4 },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.textPrimary,
        lineHeight: typography.sizes.md * 1.3,
    },
    titleDone: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    description: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
    },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: typography.sizes.xs, color: colors.textMuted },
    recurringBadge: {
        marginLeft: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
});