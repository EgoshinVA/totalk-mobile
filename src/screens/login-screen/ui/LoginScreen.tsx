import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform, SafeAreaView,
    ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { ArrowRightIcon, Lock, Mail } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useLoginMutation } from '@/entities/session/api/sessionApi';
import { setCredentials } from '@/entities/session/model/slice';
import { isBackendError } from '@/shared/api/isBackendError';
import { colors, spacing, typography } from '@/shared/styles';
import { Heading } from '@/shared/ui/Typography';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';

interface LoginScreenProps {
    onCreateAccount: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onCreateAccount }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const dispatch = useDispatch();
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();

    const validate = (): boolean => {
        const next: typeof errors = {};
        if (!email.trim()) next.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email';
        if (!password) next.password = 'Password is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        try {
            const result = await login({
                email: email.trim().toLowerCase(),
                password,
            }).unwrap();

            console.log('✅ Login success, saving refreshToken...');
            await SecureStore.setItemAsync('refreshToken', result.refreshToken);
            dispatch(setCredentials(result));

            // Явный редирект — не ждём пока guard сработает
            router.replace('/(dashboard)');
        } catch (e) {
            const message = isBackendError(e)
                ? e.data.message
                : 'Could not sign in. Check your connection.';
            Alert.alert('Error', message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: -100, left: 200 }} />
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: 400, left: -100 }} />
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    <View style={styles.headingSection}>
                        <Heading style={styles.heading}>Welcome back</Heading>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email address"
                            placeholder="name@example.com"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
                            error={errors.email}
                            leftIcon={<Mail size={18} color={colors.textMuted} />}
                            editable={!isLoading}
                        />
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                            error={errors.password}
                            isPassword
                            leftIcon={<Lock size={18} color={colors.textMuted} />}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.ctaSection}>
                        <Button
                            label="Sign In"
                            onPress={handleLogin}
                            size="lg"
                            style={styles.ctaButton}
                            loading={isLoading}
                            rightIcon={<ArrowRightIcon color={colors.background} />}
                        />
                        <TouchableOpacity onPress={onCreateAccount} hitSlop={{ top: 8, bottom: 8 }}>
                            <Text style={styles.switchText}>
                                Don&#39;t have an account?{' '}
                                <Text style={styles.switchLink}>Sign up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, justifyContent: 'center', gap: spacing.xl },
    headingSection: { gap: spacing.xs },
    heading: { textAlign: 'center' },
    form: { gap: spacing.md },
    ctaSection: { gap: spacing.lg, alignItems: 'center', marginTop: spacing.md },
    ctaButton: { width: '100%' },
    switchText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
    switchLink: { color: colors.accent, fontWeight: '600' },
});