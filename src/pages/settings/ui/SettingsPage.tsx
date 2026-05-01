import React, {useState} from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Bell, CheckCircle, ChevronRight, Globe, LogOut, Shield, Trash2, User,} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {borderRadius, colors, spacing, typography} from '@/shared/styles';
import {logout} from '@/entities/session/model/slice';
import {RootState} from '@/app/store';
import {useRouter} from "expo-router";

export const SettingsPage: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.session.user);

    const router = useRouter();

    const [reminderOffset, setReminderOffset] = useState<number | null>(5);

    const REMINDER_OPTIONS: { label: string; value: number | null }[] = [
        { label: 'Не напоминать', value: null },
        { label: 'За 5 минут', value: 5 },
        { label: 'За 15 минут', value: 15 },
        { label: 'За 30 минут', value: 30 },
        { label: 'За 1 час', value: 60 },
    ];

    const handleLogout = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await SecureStore.deleteItemAsync('refreshToken');
                    dispatch(logout());
                },
            },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action is irreversible. All your data will be deleted.',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

            <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.07} style={{top: -60, left: -100}}/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                {/* ── Profile card ─────────────────────────────────── */}
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

                <SectionLabel label="Напоминания" />
                <View style={styles.group}>
                    {REMINDER_OPTIONS.map((opt, i) => (
                        <React.Fragment key={String(opt.value)}>
                            {i > 0 && <Divider />}
                            <TouchableOpacity
                                style={rowStyles.row}
                                onPress={() => setReminderOffset(opt.value)}
                                activeOpacity={0.7}
                            >
                                <View style={rowStyles.iconBox}>
                                    <Bell size={18} color={colors.accent} />
                                </View>
                                <Text style={rowStyles.label}>{opt.label}</Text>
                                {reminderOffset === opt.value && (
                                    <CheckCircle size={18} color={colors.accent} />
                                )}
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>

                {/* ── App ──────────────────────────────────────────── */}
                <SectionLabel label="App"/>
                <View style={styles.group}>
                    <LinkRow
                        icon={<Globe size={18} color={colors.accent}/>}
                        label="Language"
                        value="English"
                        onPress={() => router.push('/(dashboard)/language')}
                    />
                    <Divider/>
                    <LinkRow
                        icon={<Shield size={18} color={colors.accent}/>}
                        label="Privacy Policy"
                        onPress={() => router.push('/(dashboard)/privacy-policy')}
                    />
                </View>

                {/* ── Account ──────────────────────────────────────── */}
                <SectionLabel label="Account"/>
                <View style={styles.group}>
                    <ActionRow
                        icon={<LogOut size={18} color="#E05252"/>}
                        label="Sign Out"
                        labelColor="#E05252"
                        onPress={handleLogout}
                    />
                    <Divider/>
                    <ActionRow
                        icon={<Trash2 size={18} color={colors.textMuted}/>}
                        label="Delete Account"
                        labelColor={colors.textMuted}
                        onPress={handleDeleteAccount}
                    />
                </View>

                <Text style={styles.version}>ToTalk v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

// ── Row components ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string }> = ({label}) => (
    <Text style={sectionStyles.label}>{label}</Text>
);

const Divider = () => <View style={rowStyles.divider}/>;

const ToggleRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: boolean;
    onToggle: (v: boolean) => void;
}> = ({icon, label, value, onToggle}) => (
    <View style={rowStyles.row}>
        <View style={rowStyles.iconBox}>{icon}</View>
        <Text style={rowStyles.label}>{label}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{false: colors.surface, true: colors.accent + '60'}}
            thumbColor={value ? colors.accent : colors.textMuted}
        />
    </View>
);

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

// ── Styles ────────────────────────────────────────────────────────────────────

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