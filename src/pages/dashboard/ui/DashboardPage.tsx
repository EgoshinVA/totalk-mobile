import React, { useCallback } from 'react';
import {
    FlatList, SafeAreaView, StatusBar,
    StyleSheet, Text, View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors, spacing, typography } from '@/shared/styles';
import { RootState } from '@/app/store';
import { Task } from '@/entities/tasks/model/types';
import { TaskCard } from '@/entities/tasks/ui/TaskCard';
import { RecordButton } from '@/features/record-button/ui/RecordButton';
import {
    useGetTasksQuery,
    useCompleteTaskMutation,
    useDeleteTaskMutation,
} from '@/entities/tasks/api/tasksApi';

export const DashboardPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.session.user);
    const { data: tasks = [] } = useGetTasksQuery('pending'); // только pending на дашборде
    const [completeTask] = useCompleteTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const handleToggle = useCallback((task: Task) => {
        console.log('task', task);
        completeTask(task.id);
    }, [completeTask]);

    const handleDelete = useCallback((task: Task) => {
        deleteTask(task.id);
    }, [deleteTask]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <FlatList
                data={tasks.slice(0, 5)}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<DashboardHeader userName={user?.name} />}
                renderItem={({ item }) => (
                    <TaskCard task={item} onToggle={handleToggle} onDelete={handleDelete} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={<DashboardFooter />}
            />
        </SafeAreaView>
    );
};

const DashboardHeader: React.FC<{ userName?: string }> = ({ userName }) => (
    <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
    </View>
);

const DashboardFooter: React.FC = () => (
    <View style={styles.footer}>
        <RecordButton size={128} />
    </View>
);

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
        gap: 0,
    },
    header: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
        gap: spacing.xs,
    },
    greeting: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    sectionTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    separator: { height: spacing.sm },
    footer: {
        alignItems: 'center',
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xl,
    },
});