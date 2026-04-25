import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    StatusBar, FlatList, ScrollView,
} from 'react-native';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';
import { colors, spacing, typography } from '@/shared/styles';
import { FilterChip } from '@/features/filter-chip/ui/FilterChip';
import { Task, TaskFilter } from '@/entities/tasks/model/types';
import { TaskCard } from '@/entities/tasks/ui/TaskCard';
import {
    useGetTasksQuery,
    useCompleteTaskMutation,
    useDeleteTaskMutation,
} from '@/entities/tasks/api/tasksApi';

const FILTERS: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'done', label: 'Done' },
    { key: 'canceled', label: 'Canceled' },
];

export const TasksPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

    const { data: tasks = [], isLoading } = useGetTasksQuery(activeFilter);
    const [completeTask] = useCompleteTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const counts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        done: tasks.filter(t => t.status === 'done').length,
        canceled: tasks.filter(t => t.status === 'canceled').length,
    };

    const pendingCount = useGetTasksQuery('pending').data?.length ?? 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.07} style={{ top: -60, right: -120 }} />

            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Text style={styles.subtitle}>{pendingCount} pending</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
                style={styles.filterRow}
            >
                {FILTERS.map(f => (
                    <FilterChip
                        key={f.key}
                        label={`${f.label}${activeFilter === 'all' ? ` ${counts[f.key]}` : ''}`}
                        active={activeFilter === f.key}
                        onPress={() => setActiveFilter(f.key)}
                    />
                ))}
            </ScrollView>

            <FlatList
                data={tasks}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        onToggle={(t) => completeTask(t.id)}
                        onDelete={(t) => deleteTask(t.id)}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
                ListEmptyComponent={<EmptyState filter={activeFilter} isLoading={isLoading} />}
            />
        </SafeAreaView>
    );
};

const EmptyState: React.FC<{ filter: TaskFilter; isLoading: boolean }> = ({ filter, isLoading }) => (
    <View style={emptyStyles.container}>
        <Text style={emptyStyles.icon}>
            {isLoading ? '⏳' : filter === 'done' ? '✅' : filter === 'canceled' ? '🚫' : '🎙️'}
        </Text>
        <Text style={emptyStyles.text}>
            {isLoading
                ? 'Loading...'
                : filter === 'done'
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

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
    },
    title: { fontSize: typography.sizes.xxl, fontWeight: '700', color: colors.textPrimary },
    subtitle: { fontSize: typography.sizes.sm, color: colors.textMuted },
    filterRow: { flexGrow: 0, marginBottom: spacing.sm },
    filters: { paddingHorizontal: spacing.lg, gap: spacing.sm },
    list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
});