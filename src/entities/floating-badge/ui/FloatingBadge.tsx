import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {borderRadius, colors} from "@/shared/styles";

interface FloatingBadgeProps {
  children: React.ReactNode;
  style?: ViewStyle;
  color?: string;
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  children,
  style,
  color = colors.surface,
}) => (
  <View style={[styles.badge, { backgroundColor: color }, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  badge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
