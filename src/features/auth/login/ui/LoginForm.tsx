import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { useLoginMutation } from '@/entities/session/api/sessionApi';
import { setCredentials } from '@/entities/session/model/slice';
import { isBackendError } from '@/shared/api/isBackendError';
import {Input} from "@/shared/ui/Input";
import {colors, spacing} from "@/shared/styles";
import {Button} from "@/shared/ui/Button";

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const dispatch = useDispatch();
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
                email: email,
                password,
            }).unwrap();

            await SecureStore.setItemAsync('refresh_token', result.refreshToken);
            dispatch(setCredentials(result));
        } catch (e) {
            const message = isBackendError(e)
                ? e.data.message
                : 'Could not sign in. Check your connection.';
            Alert.alert('Error', message);
        }
    };

    return (
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

            <Button
                label="Sign In"
                onPress={handleLogin}
                size="lg"
                loading={isLoading}
                style={styles.submitButton}
                rightIcon={<Text style={styles.arrow}>→</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        gap: spacing.md,
    },
    submitButton: {
        marginTop: spacing.xs,
        width: '100%',
    },
    arrow: {
        color: colors.textPrimary,
        fontSize: 17,
        fontWeight: '600',
    },
});