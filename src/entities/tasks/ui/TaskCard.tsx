import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {CheckCircle, Clock, RefreshCw, Trash2, XCircle} from 'lucide-react-native';
import {borderRadius, colors, spacing, typography} from '@/shared/styles';
import {Task} from '@/entities/tasks/model/types';

const DELETE_BTN_WIDTH = 80;
const SWIPE_THRESHOLD = -40;

function formatSchedule(iso?: string | null): string {
    if (!iso) return '';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const taskDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Ручное форматирование времени (надежнее токенов)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (taskDay.getTime() === today.getTime()) return `Today, ${timeStr}`;
    if (taskDay.getTime() === tomorrow.getTime()) return `Tomorrow, ${timeStr}`;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${timeStr}`;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, onToggle, onPress, onDelete}) => {
    const isDone = task.status === 'done';
    const isCanceled = task.status === 'canceled';
    const isInactive = isDone || isCanceled;

    // Проверка на просроченность
    const isOverdue = !isInactive && task.scheduledAt && new Date(task.scheduledAt) < new Date();

    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => {
                const isHorizontal = Math.abs(g.dx) > Math.abs(g.dy) * 2;
                const isLeftSwipe = g.dx < 0;
                const isClosingSwipe = isOpen.current && g.dx > 0;
                return isHorizontal && (isLeftSwipe || isClosingSwipe);
            },
            onPanResponderMove: (_, g) => {
                const base = isOpen.current ? -DELETE_BTN_WIDTH : 0;
                const val = base + g.dx;
                translateX.setValue(Math.max(-DELETE_BTN_WIDTH, Math.min(0, val)));
            },
            onPanResponderRelease: (_, g) => {
                const shouldOpen = isOpen.current ? g.dx > 20 : g.dx < SWIPE_THRESHOLD;
                if (shouldOpen && !isOpen.current) {
                    Animated.spring(translateX, {
                        toValue: -DELETE_BTN_WIDTH,
                        useNativeDriver: true,
                        bounciness: 0,
                    }).start();
                    isOpen.current = true;
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                    }).start();
                    isOpen.current = false;
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                }).start();
                isOpen.current = false;
            },
        })
    ).current;

    const closeSwipe = () => {
        Animated.spring(translateX, {toValue: 0, useNativeDriver: true, bounciness: 0}).start();
        isOpen.current = false;
    };

    const formattedTime = formatSchedule(task.scheduledAt);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                    closeSwipe();
                    onDelete?.(task);
                }}
                activeOpacity={0.8}
            >
                <Trash2 size={24} color="#fff"/>
            </TouchableOpacity>

            <Animated.View
                style={[styles.swipeable, {transform: [{translateX}]}]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity
                    style={[styles.card, isInactive && styles.cardInactive]}
                    onPress={() => {
                        if (isOpen.current) {
                            closeSwipe();
                            return;
                        }
                        onPress?.(task);
                    }}
                    activeOpacity={0.9}
                >
                    {/* Чекбокс */}
                    <TouchableOpacity
                        style={[styles.checkbox, isDone && styles.checkboxDone]}
                        onPress={() => onToggle?.(task)}
                        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                    >
                        {isDone && <CheckCircle size={24} color={colors.accent} fill={`${colors.accent}15`}/>}
                        {isCanceled && <XCircle size={20} color={colors.textMuted}/>}
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={[styles.title, isInactive && styles.titleDone]} numberOfLines={2}>
                            {task.title}
                        </Text>

                        <View style={styles.meta}>
                            {formattedTime && !isInactive && (
                                <View style={styles.timeBadge}>
                                    <Clock size={11} color={isOverdue ? '#FF5252' : colors.textSecondary}/>
                                    <Text style={[styles.metaText, isOverdue && styles.metaTextOverdue]}>
                                        {formattedTime}
                                    </Text>
                                </View>
                            )}

                            {isDone && <Text style={styles.statusTextDone}>Completed</Text>}
                            {isCanceled &&
                                <Text style={[styles.statusTextDone, {color: colors.textMuted}]}>Canceled</Text>}

                            {task.isRecurring && (
                                <View style={styles.recurringBadge}>
                                    <RefreshCw size={10} color={isInactive ? colors.textMuted : colors.accent}/>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

interface TaskCardProps {
    task: Task;
    onToggle?: (task: Task) => void;
    onPress?: (task: Task) => void;
    onDelete?: (task: Task) => void;
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    deleteBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: DELETE_BTN_WIDTH,
        backgroundColor: '#E53935',
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    swipeable: {
        zIndex: 2,
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.md,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardInactive: {
        borderColor: colors.borderColor,
        backgroundColor: colors.surfaceDark,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    checkboxDone: {borderColor: 'transparent'},
    content: {flex: 1, gap: 1},
    title: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 1,
    },
    titleDone: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    description: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
        marginBottom: 3,
    },
    meta: {flexDirection: 'row', alignItems: 'center', gap: 6},
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 2,
    },
    metaText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '500'
    },
    metaTextOverdue: {
        color: '#FF5252',
        fontWeight: '600'
    },
    statusTextDone: {
        fontSize: 10,
        color: colors.accent,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    recurringBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
});