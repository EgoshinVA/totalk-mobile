import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Bell, CheckCircle, ChevronRight, Globe, LogOut, Shield, Trash2, User,} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {borderRadius, colors, spacing, typography} from '@/shared/styles';
import {logout} from '@/entities/session/model/slice';
import {RootState} from '@/app/store';
import {useRouter} from "expo-router";
import {setReminderOffset} from "@/entities/settings/model/slice";
import {useGetTasksQuery} from "@/entities/tasks/api/tasksApi";
import {requestNotificationPermission, rescheduleAllNotifications} from "@/shared/notifications/notificationService";
import {ConfirmModal} from "@/shared/ui/ConfirmModal";

export const SettingsPage: React.FC = () => {
    const [logoutModal, setLogoutModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.session.user);

    const router = useRouter();

    const reminderOffset = useSelector((state: RootState) => state.settings.reminderOffset);

    const language = useSelector((state: RootState) => state.settings.language);

    const {data: tasks = []} = useGetTasksQuery('all');

    const handleReminderChange = async (value: number | null) => {
        dispatch(setReminderOffset(value));
        const granted = await requestNotificationPermission();
        if (granted) {
            await rescheduleAllNotifications(tasks, value);
        }
    };

    const LANGUAGE_LABELS: Record<string, string> = {
        en: 'English',
        ru: 'Русский',
        es: 'Español',
        de: 'Deutsch',
        fr: 'Français',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية',
    };

    const REMINDER_OPTIONS: { label: string; value: number | null }[] = [
        {label: 'None', value: null},
        {label: '5 min', value: 5},
        {label: '15 min', value: 15},
        {label: '30 min', value: 30},
        {label: '1 hour', value: 60},
    ];

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        dispatch(logout());
    };

    const handleDeleteAccount = () => {
        // TODO: вызов API
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

            <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.07} style={{top: -60, left: -100}}/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    style={styles.profileCard}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(dashboard)/edit-profile')}
                >
                    <View style={styles.avatarCircle}>
                        <User size={28} color={colors.accent}/>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {[user?.name, user?.surName].filter(Boolean).join(' ') || 'Your Name'}
                        </Text>
                        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.textMuted}/>
                </TouchableOpacity>

                <SectionLabel label="Reminders"/>
                <View style={styles.group}>
                    {REMINDER_OPTIONS.map((opt, i) => (
                        <React.Fragment key={String(opt.value)}>
                            {i > 0 && <Divider/>}
                            <TouchableOpacity
                                style={rowStyles.row}
                                onPress={() => handleReminderChange(opt.value)}
                                activeOpacity={0.7}
                            >
                                <View style={rowStyles.iconBox}>
                                    <Bell size={18} color={colors.accent}/>
                                </View>
                                <Text style={rowStyles.label}>{opt.label}</Text>
                                {reminderOffset === opt.value && (
                                    <CheckCircle size={18} color={colors.accent}/>
                                )}
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>

                <SectionLabel label="App"/>
                <View style={styles.group}>
                    <LinkRow
                        icon={<Globe size={18} color={colors.accent}/>}
                        label="Language"
                        value={LANGUAGE_LABELS[language] ?? 'English'}
                        onPress={() => router.push('/(dashboard)/language')}
                    />
                    <Divider/>
                    <LinkRow
                        icon={<Shield size={18} color={colors.accent}/>}
                        label="Privacy Policy"
                        onPress={() => router.push('/(dashboard)/privacy-policy')}
                    />
                </View>

                <SectionLabel label="Account"/>
                <View style={styles.group}>
                    <ActionRow
                        icon={<LogOut size={18} color="#E05252"/>}
                        label="Sign Out"
                        labelColor="#E05252"
                        onPress={() => setLogoutModal(true)}
                    />
                    <Divider/>
                    <ActionRow
                        icon={<Trash2 size={18} color={colors.textMuted}/>}
                        label="Delete Account"
                        labelColor={colors.textMuted}
                        onPress={() => setDeleteModal(true)}
                    />
                </View>

                <Text style={styles.version}>ToTalk v1.0.0</Text>
            </ScrollView>

            <ConfirmModal
                visible={logoutModal}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                onClose={() => setLogoutModal(false)}
                actions={[
                    { label: 'Sign Out', destructive: true, onPress: handleLogout },
                ]}
            />

            <ConfirmModal
                visible={deleteModal}
                title="Delete Account"
                message="This action is irreversible. All your data will be deleted."
                onClose={() => setDeleteModal(false)}
                actions={[
                    { label: 'Delete', destructive: true, onPress: handleDeleteAccount },
                ]}
            />
        </SafeAreaView>
    );
};

const SectionLabel: React.FC<{ label: string }> = ({label}) => (
    <Text style={sectionStyles.label}>{label}</Text>
);

const Divider = () => <View style={rowStyles.divider}/>;

const LinkRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: string;
    onPress: () => void;
}> = ({icon, label, value, onPress}) => (
    <TouchableOpacity style={rowStyles.row} onPress={onPress} activeOpacity={0.7}>
        <View style={rowStyles.iconBox}>{icon}</View>
        <Text style={rowStyles.label}>{label}</Text>
        <View style={rowStyles.right}>
            {value && <Text style={rowStyles.value}>{value}</Text>}
            <ChevronRight size={16} color={colors.textMuted}/>
        </View>
    </TouchableOpacity>
);

const ActionRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    labelColor: string;
    onPress: () => void;
}> = ({icon, label, labelColor, onPress}) => (
    <TouchableOpacity style={rowStyles.row} onPress={onPress} activeOpacity={0.7}>
        <View style={rowStyles.iconBox}>{icon}</View>
        <Text style={[rowStyles.label, {color: labelColor}]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: colors.background},
    scroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xxxl,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.recordColor,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 1.5,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceElevated,
    },
    profileInfo: {flex: 1, gap: 2},
    profileName: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    profileEmail: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
    },
    group: {
        backgroundColor: colors.recordColor,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.xl,
        overflow: 'hidden',
    },
    version: {
        textAlign: 'center',
        fontSize: typography.sizes.xs,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
});

const sectionStyles = StyleSheet.create({
    label: {
        fontSize: typography.sizes.xs,
        fontWeight: '600',
        color: colors.textMuted,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
});

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        flex: 1,
        fontSize: typography.sizes.md,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    value: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background,
        marginHorizontal: spacing.md,
    },
});