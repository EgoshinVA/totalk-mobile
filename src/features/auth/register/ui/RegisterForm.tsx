import React, { useState, useMemo } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import {useRegisterMutation} from "@/entities/session/api/sessionApi";
import {isBackendError} from "@/shared/api/isBackendError";

interface Props {
    onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [register, { isLoading, error }] = useRegisterMutation();

    // Валидация "на лету" через useMemo для производительности
    const validation = useMemo(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const isPasswordValid = password.length >= 8;
        const isMatch = password === confirmPassword && password.length > 0;

        return {
            isEmailValid,
            isPasswordValid,
            isMatch,
            isValid: isEmailValid && isPasswordValid && isMatch
        };
    }, [email, password, confirmPassword]);

    const handleRegister = async () => {
        if (!validation.isValid) return;

        try {
            // Очищаем email от лишних пробелов перед отправкой
            await register({
                email: email.trim().toLowerCase(),
                password
            }).unwrap();

            Alert.alert('Успех', 'Регистрация прошла успешно! Теперь войдите в аккаунт.');
            onSuccess();
        } catch (e) {
            // Если бэкенд прислал JSON с message, выводим его
            const errorMessage = isBackendError(e)
                ? e.data.message
                : 'Не удалось зарегистрироваться. Проверьте соединение.';

            Alert.alert('Ошибка', errorMessage);
        }
    };

    return (
        <View style={styles.form}>
            <View>
                <TextInput
                    style={[styles.input, !validation.isEmailValid && email.length > 0 && styles.inputError]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />
                {!validation.isEmailValid && email.length > 0 && (
                    <Text style={styles.hint}>Введите корректный email</Text>
                )}
            </View>

            <View>
                <TextInput
                    style={[styles.input, !validation.isPasswordValid && password.length > 0 && styles.inputError]}
                    placeholder="Пароль (мин. 8 символов)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading}
                />
            </View>

            <View>
                <TextInput
                    style={[styles.input, !validation.isMatch && confirmPassword.length > 0 && styles.inputError]}
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isLoading}
                />
                {!validation.isMatch && confirmPassword.length > 0 && (
                    <Text style={styles.hint}>Пароли не совпадают</Text>
                )}
            </View>

            {/* Блок вывода ошибки от RTK Query (если не через Alert) */}
            {error && (
                <Text style={styles.errorText}>
                    {isBackendError(error) ? error.data.message : 'Ошибка сервера'}
                </Text>
            )}

            <TouchableOpacity
                onPress={handleRegister}
                disabled={!validation.isValid || isLoading}
                style={[
                    styles.submitButton,
                    (!validation.isValid || isLoading) && styles.buttonDisabled
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    form: { gap: 15, width: '100%' },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ef4444',
    },
    hint: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        // Тень для iOS
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        // Тень для Android
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});