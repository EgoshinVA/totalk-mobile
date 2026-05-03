import React, {useCallback, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CheckSquare, Mic, Settings} from 'lucide-react-native';
import {colors, typography} from '@/shared/styles';
import {SettingsPage} from "@/pages/settings/ui/SettingsPage";
import {DashboardPage} from "@/pages/dashboard/ui/DashboardPage";
import {TasksPage} from "@/pages/tasks/ui/TasksPage";

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

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<TabIndex>(1);
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
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={1}
                scrollEnabled={false}
                onPageSelected={handlePageSelected}
                overdrag
            >
                {TABS.map(({key, component: Screen}) => (
                    <View key={key} style={styles.page}>
                        <Screen/>
                    </View>
                ))}
            </PagerView>

            <CustomTabBar
                activeTab={activeTab}
                onPress={handleTabPress}
                bottomInset={insets.bottom}
            />
        </View>
    );
}

interface CustomTabBarProps {
    activeTab: TabIndex;
    onPress: (i: TabIndex) => void;
    bottomInset: number;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({activeTab, onPress, bottomInset}) => (
    <View style={[styles.tabBar, {paddingBottom: bottomInset + 10}]}>
        {TABS.map(({key, label, Icon}, index) => {
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

interface TabItemProps {
    label: string;
    Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
    isActive: boolean;
    isCenter: boolean;
    onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({label, Icon, isActive, isCenter, onPress}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, {toValue: 0.9, duration: 80, useNativeDriver: true}),
            Animated.timing(scale, {toValue: 1, duration: 120, useNativeDriver: true}),
        ]).start();
        onPress();
    };

    const iconColor = isActive ? colors.accent : colors.textMuted;

    return (
        <TouchableOpacity style={styles.tabItem} onPress={handlePress} activeOpacity={0.8}>
            <Animated.View style={[
                styles.tabContent,
                isCenter && styles.centerTabContent,
                (isCenter && isActive) && styles.centerTabActive,
                {transform: [{scale}]}
            ]}>
                <Icon size={24} color={iconColor} strokeWidth={1.8}/>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

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

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#0F0F0F',
        paddingTop: 16,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },

    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
    },

    centerTabContent: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 32,
    },
    centerTabActive: {
        backgroundColor: `${colors.accent}15`,
    },

    tabLabel: {
        fontSize: typography.sizes.xs,
        color: colors.textMuted,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: colors.accent,
    },
});