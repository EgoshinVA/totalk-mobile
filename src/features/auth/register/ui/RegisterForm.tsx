import React, {useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {ArrowRightIcon, Lock, Mail} from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

import {Input} from '@/shared/ui/Input';
import {colors, spacing} from '@/shared/styles';
import {Checkbox} from '@/shared/ui/Checkbox';
import {Button} from '@/shared/ui/Button';
import {useRegisterStep1Mutation} from "@/entities/session/api/sessionApi";

interface Props {
    onNext: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [termsError, setTermsError] = useState<string | undefined>();

    const [registerStep1, { isLoading, error }] = useRegisterStep1Mutation();

    const validation = useMemo(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const isPasswordValid = password.length >= 8;
        const isMatch = password === confirmPassword && password.length > 0;
        return { isEmailValid, isPasswordValid, isMatch, isValid: isEmailValid && isPasswordValid && isMatch };
    }, [email, password, confirmPassword]);

    const emailError = !validation.isEmailValid && email.length > 0 ? 'Enter a valid email' : undefined;
    const passwordError = !validation.isPasswordValid && password.length > 0 ? 'At least 8 characters' : undefined;
    const confirmError = !validation.isMatch && confirmPassword.length > 0 ? 'Passwords do not match' : undefined;

    const handleNext = async () => {
        if (!agreedToTerms) { setTermsError('You must agree to continue'); return; }
        if (!validation.isValid) return;

        try {
            const result = await registerStep1({
                email: email.trim(),
                password,
            }).unwrap();

            console.log('📦 Registration step 1 result:', result);

            if (result.registrationToken) {
                await SecureStore.setItemAsync('registration_token', result.registrationToken);
                onNext();
            } else {
                Alert.alert('Error', 'No registration token received');
            }
        } catch (e) {
            console.log('❌ Registration error details:', JSON.stringify(e, null, 2));

            // Проверяем разные форматы ошибок
            if (e && typeof e === 'object') {
                // Формат RTK Query ошибки с data
                if ('data' in e && e.data) {
                    const errorData = e.data as any;
                    const message = errorData.message || errorData.error || 'Registration failed';
                    Alert.alert('Error', message);
                    return;
                }

                // Формат с error внутри
                if ('error' in e && e.error) {
                    Alert.alert('Error', String(e.error));
                    return;
                }

                // Стандартная ошибка
                if ('message' in e && e.message) {
                    Alert.alert('Error', String(e.message));
                    return;
                }
            }

            // Fallback
            Alert.alert('Error', 'Could not register. Check your connection.');
        }
    };

    return (
        <View style={styles.form}>
            {error && (
                <Text style={styles.errorBanner}>
                    {JSON.stringify(error)}
                </Text>
            )}
            <Input
                label="Email address"
                placeholder="name@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                leftIcon={<Mail size={18} color={colors.textMuted} />}
                editable={!isLoading}
                autoCapitalize="none"
            />
            <Input
                label="Password"
                placeholder="Min. 8 characters"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                isPassword
                leftIcon={<Lock size={18} color={colors.textMuted} />}
                editable={!isLoading}
            />
            <Input
                label="Confirm password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmError}
                isPassword
                leftIcon={<Lock size={18} color={colors.textMuted} />}
                editable={!isLoading}
            />
            <View style={styles.termsRow}>
                <Checkbox checked={agreedToTerms} onToggle={() => { setAgreedToTerms(v => !v); setTermsError(undefined); }} />
                <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
            </View>
            {termsError && <Text style={styles.termsError}>{termsError}</Text>}
            <Button
                label="Next"
                onPress={handleNext}
                size="lg"
                loading={isLoading}
                disabled={!validation.isValid || !agreedToTerms}
                style={styles.submitButton}
                rightIcon={<ArrowRightIcon size={18} color={colors.background} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    form: { gap: spacing.md },
    termsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
    termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
    termsLink: { color: colors.textPrimary, textDecorationLine: 'underline' },
    termsError: { fontSize: 11, color: '#E05252', marginTop: -spacing.xs },
    submitButton: { marginTop: spacing.xs, width: '100%' },
    errorBanner: {
        backgroundColor: '#FFF3F3',
        padding: spacing.sm,
        borderRadius: 8,
        color: '#E05252',
        fontSize: 12,
    },
});