import React from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {ArrowLeft, Check} from 'lucide-react-native';
import {useRouter} from 'expo-router';
import {borderRadius, colors, spacing, typography} from '@/shared/styles';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {setLanguage} from "@/entities/settings/model/slice";

const LANGUAGES = [
    {code: 'en', label: 'English', native: 'English'},
    {code: 'ru', label: 'Russian', native: 'Русский'},
    {code: 'es', label: 'Spanish', native: 'Español'},
    {code: 'de', label: 'German', native: 'Deutsch'},
    {code: 'fr', label: 'French', native: 'Français'},
    {code: 'zh', label: 'Chinese', native: '中文'},
    {code: 'ja', label: 'Japanese', native: '日本語'},
    {code: 'ar', label: 'Arabic', native: 'العربية'},
];

export const LanguageScreen: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const selected = useSelector((state: RootState) => state.settings.language);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

            {/* ── Nav ────────────────────────────────────────────── */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                    <ArrowLeft size={22} color={colors.textPrimary}/>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Language</Text>
                <View style={{width: 22}}/>
            </View>

            <FlatList
                data={LANGUAGES}
                keyExtractor={item => item.code}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.divider}/>}
                renderItem={({item}) => {
                    const isActive = selected === item.code;
                    return (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => dispatch(setLanguage(item.code))}
                            activeOpacity={0.7}
                        >
                            <View style={styles.rowTexts}>
                                <Text style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                                    {item.label}
                                </Text>
                                <Text style={styles.rowNative}>{item.native}</Text>
                            </View>
                            {isActive && <Check size={18} color={colors.accent}/>}
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: colors.background},
    nav: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.sm,
    },
    navTitle: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
    list: {
        marginHorizontal: spacing.lg,
        backgroundColor: colors.recordColor,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginTop: spacing.md,
    },
    row: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.md, paddingVertical: spacing.md + 2,
    },
    rowTexts: {flex: 1, gap: 2},
    rowLabel: {fontSize: typography.sizes.md, fontWeight: '500', color: colors.textPrimary},
    rowLabelActive: {color: colors.accent},
    rowNative: {fontSize: typography.sizes.sm, color: colors.textMuted},
    divider: {height: 1, backgroundColor: colors.background, marginHorizontal: spacing.md},
});
