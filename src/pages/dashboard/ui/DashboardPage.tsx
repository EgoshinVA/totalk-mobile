import React, {useCallback, useState} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View,} from 'react-native';
import {colors, spacing, typography} from '@/shared/styles';
import {Task} from '@/entities/tasks/model/types';
import {TaskCard} from '@/entities/tasks/ui/TaskCard';
import {RecordButton} from '@/features/record-button/ui/RecordButton';
import {useCompleteTaskMutation, useDeleteTaskMutation, useGetTasksQuery,} from '@/entities/tasks/api/tasksApi';
import {TaskEditModal} from "@/features/task-sheet-modal/ui/TaskEditModal";

export const DashboardPage: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const {data: tasks = []} = useGetTasksQuery('pending');
    const [completeTask] = useCompleteTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const handleOpenModal = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleToggle = useCallback((task: Task) => {
        completeTask(task.id);
    }, [completeTask]);

    const handleDelete = useCallback((task: Task) => {
        deleteTask(task.id);
    }, [deleteTask]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

            {/* Список задач — занимает всё свободное место */}
            <View style={styles.listContainer}>
                <Text style={styles.title}>Recent Tasks</Text>
                <FlatList
                    data={tasks.slice(0, 5)}
                    keyExtractor={item => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    directionalLockEnabled={true}
                    contentContainerStyle={styles.listContent}
                    renderItem={({item}) => (
                        <TaskCard
                            task={item}
                            onPress={() => handleOpenModal(item)}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator}/>}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Нет задач. Удержи кнопку и скажи что сделать.</Text>
                        </View>
                    }
                />
            </View>

            <View style={styles.footer}>
                <RecordButton size={100}/>
            </View>

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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    listContent: {
        paddingBottom: spacing.md,
    },
    separator: {height: spacing.sm},
    empty: {
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: spacing.xl,
        paddingTop: spacing.lg,
    },
});