import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/shared/styles';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'We collect information you provide when creating an account: your email address, name, city, and optionally a profile picture. We also collect voice recordings you make within the app in order to transcribe them into tasks.',
  },
  {
    title: 'How We Use Your Data',
    body: 'Your data is used solely to provide the ToTalk service — creating tasks from voice input, sending reminders, and personalizing your experience. We do not sell your data to third parties.',
  },
  {
    title: 'Data Storage & Security',
    body: 'All data is stored on secure servers. Access tokens are stored in device memory only. Refresh tokens are stored in the device\'s encrypted Secure Store. We use HTTPS for all communications.',
  },
  {
    title: 'Voice Recordings',
    body: 'Audio is transmitted over an encrypted connection, transcribed, and not retained after processing. The resulting text and task data are stored under your account.',
  },
  {
    title: 'Your Rights',
    body: 'You can request deletion of your account and all associated data at any time from Settings → Delete Account. Deletion is permanent and irreversible.',
  },
  {
    title: 'Contact',
    body: 'For any privacy-related questions, contact us at privacy@totalk.app.',
  },
];

export const PrivacyPolicyScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Nav ────────────────────────────────────────────── */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Privacy Policy</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: April 2026</Text>

        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
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
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  updated: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionBody: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * 1.65,
  },
});
