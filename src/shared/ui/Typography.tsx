import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import {colors, typography} from "@/shared/styles";

interface TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

export const Heading: React.FC<TextProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.heading, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const Subheading: React.FC<TextProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.subheading, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const BodyText: React.FC<TextProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.body, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const Caption: React.FC<TextProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.caption, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: typography.sizes.xxxl * 1.15,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: typography.sizes.xl * 1.2,
  },
  body: {
    fontSize: typography.sizes.md,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: typography.sizes.md * 1.6,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: typography.sizes.sm * 1.5,
  },
});
