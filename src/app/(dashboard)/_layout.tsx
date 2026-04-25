import React, {useCallback, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CheckSquare, Mic, Settings} from 'lucide-react-native';
import {borderRadius, colors, typography} from '@/shared/styles';
import {SettingsPage} from "@/pages/settings/ui/SettingsPage";
import {DashboardPage} from "@/pages/dashboard/ui/DashboardPage";
import {TasksPage} from "@/pages/tasks/ui/TasksPage";

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
    {
        key: 'tasks',
        label: 'Tasks',
        Icon: CheckSquare,
        component: TasksPage,
    },
    {
        key: 'record',
        label: 'Record',
        Icon: Mic,
        component: DashboardPage,
    },
    {
        key: 'settings',
        label: 'Settings',
        Icon: Settings,
        component: SettingsPage,
    },
] as const;

type TabIndex = 0 | 1 | 2;

// ── Layout ────────────────────────────────────────────────────────────────────

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<TabIndex>(1); // start on Record/Dashboard
    const pagerRef = useRef<PagerView>(null);
    const insets = useSafeAreaInsets();

    const handleTabPress = useCallback((index: TabIndex) => {
        setActiveTab(index);
        pagerRef.current?.setPage(index);
    }, []);

    const handlePageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
        setActiveTab(e.nativeEvent.position as TabIndex);
    }, []);

    return (
        <View style={styles.container}>
            {/* ── Swipeable pages ──────────────────────────────── */}
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={1}
                onPageSelected={handlePageSelected}
                overdrag
            >
                {TABS.map(({ key, component: Screen }) => (
                    <View key={key} style={styles.page}>
                        <Screen />
                    </View>
                ))}
            </PagerView>

            {/* ── Custom tab bar ───────────────────────────────── */}
            <CustomTabBar
                activeTab={activeTab}
                onPress={handleTabPress}
                bottomInset={insets.bottom}
            />
        </View>
    );
}

// ── Custom Tab Bar ────────────────────────────────────────────────────────────

interface CustomTabBarProps {
    activeTab: TabIndex;
    onPress: (i: TabIndex) => void;
    bottomInset: number;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ activeTab, onPress, bottomInset }) => (
    <View style={[styles.tabBar, { paddingBottom: bottomInset || 12 }]}>
        {TABS.map(({ key, label, Icon }, index) => {
            const isActive = activeTab === index;
            const isCenter = index === 1;

            return (
                <TabItem
                    key={key}
                    label={label}
                    Icon={Icon}
                    isActive={isActive}
                    isCenter={isCenter}
                    onPress={() => onPress(index as TabIndex)}
                />
            );
        })}
    </View>
);

// ── Tab Item ──────────────────────────────────────────────────────────────────

interface TabItemProps {
    label: string;
    Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
    isActive: boolean;
    isCenter: boolean;
    onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, Icon, isActive, isCenter, onPress }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    if (isCenter) {
        return (
            <TouchableOpacity style={styles.tabItemCenter} onPress={handlePress} activeOpacity={1}>
                <Animated.View style={[styles.centerButton, isActive && styles.centerButtonActive, { transform: [{ scale }] }]}>
                    <Icon size={22} color={isActive ? colors.textPrimary : colors.accent} strokeWidth={1.8} />
                </Animated.View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.tabItem} onPress={handlePress} activeOpacity={1}>
            <Animated.View style={[styles.tabIconWrapper, isActive && styles.tabIconWrapperActive, { transform: [{ scale }] }]}>
                <Icon size={20} color={isActive ? colors.accent : colors.textMuted} strokeWidth={1.8} />
            </Animated.View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
        </TouchableOpacity>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
    },

    // Tab bar
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceElevated,
    },

    // Regular tab
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    tabIconWrapper: {
        width: 40,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconWrapperActive: {
        backgroundColor: colors.surfaceElevated,
    },

    // Center tab
    tabItemCenter: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    centerButton: {
        width: 52,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.accent + '50',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 8,
        elevation: 0,
    },
    centerButtonActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        shadowOpacity: 0.5,
        elevation: 8,
    },

    // Labels
    tabLabel: {
        fontSize: typography.sizes.xs,
        color: colors.textMuted,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: colors.accent,
    },
});