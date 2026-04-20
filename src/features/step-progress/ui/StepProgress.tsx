import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {borderRadius, colors, spacing, typography} from "@/shared/styles";

interface StepProgressProps {
  current: number;
  total: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ current, total }) => {
  const progress = current / total;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        STEP {current} OF {total}
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { flex: progress }]} />
        <View style={{ flex: 1 - progress }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1.2,
  },
  track: {
    flexDirection: 'row',
    width: '100%',
    height: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
});
