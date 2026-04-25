import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList,
    ScrollView,
} from 'react-native';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';
import { colors, spacing, typography } from '@/shared/styles';
import {FilterChip} from "@/features/filter-chip/ui/FilterChip";
import {Task, TaskFilter} from "@/entities/tasks/model/types";
import {TaskCard} from "@/entities/tasks/ui/TaskCard";

// ── Mock — заменишь на RTK Query ─────────────────────────────────────────────
const MOCK_TASKS: Task[] = [
    {
        id: 1, userId: 1, title: 'Prepare Q3 Marketing Presentation',
        status: 'pending', isRecurring: false,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 2, userId: 1, title: 'Call Sarah regarding design assets',
        status: 'pending', isRecurring: false,
        scheduledAt: new Date(Date.now() + 7200000).toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 3, userId: 1, title: 'Review budget proposal',
        status: 'done', isRecurring: false, scheduledAt: null,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 4, userId: 1, title: 'Weekly team sync',
        status: 'pending', isRecurring: true, recurringRule: 'weekly',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 5, userId: 1, title: 'Send invoice to client',
        status: 'canceled', isRecurring: false, scheduledAt: null,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 6, userId: 1, title: 'Update project roadmap',
        status: 'done', isRecurring: false, scheduledAt: null,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
];

const FILTERS: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'done', label: 'Done' },
    { key: 'canceled', label: 'Canceled' },
];

export const TasksPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return MOCK_TASKS;
        return MOCK_TASKS.filter(t => t.status === activeFilter);
    }, [activeFilter]);

    const counts = useMemo(() => ({
        all: MOCK_TASKS.length,
        pending: MOCK_TASKS.filter(t => t.status === 'pending').length,
        done: MOCK_TASKS.filter(t => t.status === 'done').length,
        canceled: MOCK_TASKS.filter(t => t.status === 'canceled').length,
    }), []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.07} style={{ top: -60, right: -120 }} />

            {/* ── Header ─────────────────────────────────────────── */}
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Text style={styles.subtitle}>{counts.pending} pending</Text>
            </View>

            {/* ── Filter chips ───────────────────────────────────── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
                style={styles.filterRow}
            >
                {FILTERS.map(f => (
                    <FilterChip
                        key={f.key}
                        label={`${f.label} ${counts[f.key]}`}
                        active={activeFilter === f.key}
                        onPress={() => setActiveFilter(f.key)}
                    />
                ))}
            </ScrollView>

            {/* ── List ───────────────────────────────────────────── */}
            <FlatList
                data={filtered}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TaskCard task={item} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
                ListEmptyComponent={<EmptyState filter={activeFilter} />}
            />
        </SafeAreaView>
    );
};

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ filter: TaskFilter }> = ({ filter }) => (
    <View style={emptyStyles.container}>
        <Text style={emptyStyles.icon}>
            {filter === 'done' ? '✅' : filter === 'canceled' ? '🚫' : '🎙️'}
        </Text>
        <Text style={emptyStyles.text}>
            {filter === 'done'
                ? 'No completed tasks yet'
                : filter === 'canceled'
                    ? 'No canceled tasks'
                    : 'No tasks yet. Hold record to add one.'}
        </Text>
    </View>
);

const emptyStyles = StyleSheet.create({
    container: { alignItems: 'center', paddingTop: 60, gap: 12 },
    icon: { fontSize: 40 },
    text: { fontSize: typography.sizes.sm, color: colors.textMuted, textAlign: 'center' },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
    },
    filterRow: {
        flexGrow: 0,
        marginBottom: spacing.sm,
    },
    filters: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
});