import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import {borderRadius, colors} from "@/shared/styles";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle, style }) => (
  <TouchableOpacity
    onPress={onToggle}
    activeOpacity={0.8}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={[styles.box, checked && styles.boxChecked, style]}>
      {checked && <Check size={14} color={colors.textPrimary} strokeWidth={3} />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs + 2,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  boxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
