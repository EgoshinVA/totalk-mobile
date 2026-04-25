import React, {useCallback} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {colors, spacing, typography} from '@/shared/styles';
import {RootState} from '@/app/store';
import {Task} from "@/entities/tasks/model/types";
import {TaskCard} from "@/entities/tasks/ui/TaskCard";
import {RecordButton} from "@/features/record-button/ui/RecordButton";

// ── Mock data — заменишь на RTK Query ────────────────────────────────────────
const MOCK_TASKS: Task[] = [
    {
        id: 1, userId: 1,
        title: 'Prepare Q3 Marketing Presentation',
        status: 'pending',
        isRecurring: false,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 2, userId: 1,
        title: 'Call Sarah regarding design assets',
        status: 'pending',
        isRecurring: false,
        scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString(), // today +2h
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 3, userId: 1,
        title: 'Review budget proposal',
        status: 'done',
        isRecurring: false,
        scheduledAt: null,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
];

export const DashboardPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.session.user);

    const handleToggle = useCallback((task: Task) => {
        // TODO: dispatch RTK Query mutation
        console.log('toggle', task.id);
    }, []);

    const handleRecord = () => {
        // TODO: открыть запись голоса
        console.log('record');
    };

    const recentTasks = MOCK_TASKS.slice(0, 5);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <FlatList
                data={recentTasks}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<DashboardHeader userName={user?.name} />}
                renderItem={({ item }) => (
                    <TaskCard task={item} onToggle={handleToggle} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={<DashboardFooter onRecord={handleRecord} />}
            />
        </SafeAreaView>
    );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const DashboardHeader: React.FC<{ userName?: string }> = ({ userName }) => (
    <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
    </View>
);

const DashboardFooter: React.FC<{ onRecord: () => void }> = ({ onRecord }) => (
    <View style={styles.footer}>
        <RecordButton onPress={onRecord} size={128} />
    </View>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
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
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    greetingLabel: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
    },
    greetingName: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    separator: {
        height: spacing.sm,
    },
    footer: {
        alignItems: 'center',
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xl,
    },
});