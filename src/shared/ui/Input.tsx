import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {borderRadius, colors, spacing, typography} from "@/shared/styles";

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  error,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const secure = isPassword ? !isVisible : secureTextEntry;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <RNTextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          secureTextEntry={secure}
          autoCapitalize="none"
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsVisible(v => !v)}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isVisible
              ? <Eye size={18} color={colors.textMuted} />
              : <EyeOff size={18} color={colors.textMuted} />
            }
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputError: {
    borderColor: '#E05252',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    height: '100%',
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  error: {
    fontSize: typography.sizes.xs,
    color: '#E05252',
  },
});
