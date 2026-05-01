import React, {useState} from 'react';
import {FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View,} from 'react-native';
import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {colors, spacing, typography} from '@/shared/styles';
import {FilterChip} from '@/features/filter-chip/ui/FilterChip';
import {Task, TaskFilter} from '@/entities/tasks/model/types';
import {TaskCard} from '@/entities/tasks/ui/TaskCard';
import {useCompleteTaskMutation, useDeleteTaskMutation, useGetTasksQuery,} from '@/entities/tasks/api/tasksApi';
import {TaskEditModal} from "@/features/task-sheet-modal/ui/TaskEditModal";

const FILTERS: { key: TaskFilter; label: string }[] = [
    {key: 'all', label: 'All'},
    {key: 'pending', label: 'Pending'},
    {key: 'done', label: 'Done'},
    {key: 'canceled', label: 'Canceled'},
];

export const TasksPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleOpenModal = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const {data: tasks = [], isLoading} = useGetTasksQuery(activeFilter);
    const [completeTask] = useCompleteTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>
            <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.07} style={{top: -60, right: -120}}/>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
                style={styles.filterRow}
            >
                {FILTERS.map(f => (
                    <FilterChip
                        key={f.key}
                        label={`${f.label}`}
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
                directionalLockEnabled={true}
                renderItem={({item}) => (
                    <TaskCard
                        task={item}
                        onPress={() => handleOpenModal(item)}
                        onToggle={(t) => completeTask(t.id)}
                        onDelete={(t) => deleteTask(t.id)}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: spacing.sm}}/>}
                ListEmptyComponent={<EmptyState filter={activeFilter} isLoading={isLoading}/>}
            />

            <TaskEditModal
                isVisible={isModalVisible}
                task={selectedTask}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedTask(null);
                }}
                onSave={(updated) => {
                    console.log('Update task:', updated);
                }}
            />
        </SafeAreaView>
    );
};

const EmptyState: React.FC<{ filter: TaskFilter; isLoading: boolean }> = ({filter, isLoading}) => (
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
                        : 'ToTalk is ready. Hold to record and add your first task.'}
        </Text>
    </View>
);

const emptyStyles = StyleSheet.create({
    container: {alignItems: 'center', paddingTop: 60, gap: 12},
    icon: {fontSize: 40},
    text: {fontSize: typography.sizes.sm, color: colors.textMuted, textAlign: 'center'},
});

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: colors.background, paddingTop: spacing.xxxl},
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
    },
    subtitle: {fontSize: typography.sizes.sm, color: colors.textMuted},
    filterRow: {
        flexGrow: 0,
        marginBottom: spacing.md,
        height: 40,
    },
    filters: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        alignItems: 'center',
    },
    list: {paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl},
});