import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  FlatList, TouchableOpacity,
} from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/shared/styles';

const LANGUAGES = [
  { code: 'en', label: 'English',    native: 'English' },
  { code: 'ru', label: 'Russian',    native: 'Русский' },
  { code: 'es', label: 'Spanish',    native: 'Español' },
  { code: 'de', label: 'German',     native: 'Deutsch' },
  { code: 'fr', label: 'French',     native: 'Français' },
  { code: 'zh', label: 'Chinese',    native: '中文' },
  { code: 'ja', label: 'Japanese',   native: '日本語' },
  { code: 'ar', label: 'Arabic',     native: 'العربية' },
];

export const LanguageScreen: React.FC = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('en');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Nav ────────────────────────────────────────────── */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Language</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => {
          const isActive = selected === item.code;
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => { setSelected(item.code); /* TODO: persist */ }}
              activeOpacity={0.7}
            >
              <View style={styles.rowTexts}>
                <Text style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                  {item.label}
                </Text>
                <Text style={styles.rowNative}>{item.native}</Text>
              </View>
              {isActive && <Check size={18} color={colors.accent} />}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  navTitle: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary },
  list: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md + 2,
  },
  rowTexts: { flex: 1, gap: 2 },
  rowLabel: { fontSize: typography.sizes.md, fontWeight: '500', color: colors.textPrimary },
  rowLabelActive: { color: colors.accent },
  rowNative: { fontSize: typography.sizes.sm, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.background, marginHorizontal: spacing.md },
});
