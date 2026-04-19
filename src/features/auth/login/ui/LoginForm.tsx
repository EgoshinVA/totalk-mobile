import React, { useState } from 'react';
import {View, TextInput, Button, StyleSheet, ActivityIndicator, Text, Alert} from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {useLoginMutation} from "@/entities/session/api/sessionApi";
import {setCredentials} from "@/entities/session/model/slice";
import {isBackendError} from "@/shared/api/isBackendError";

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();

    const handleLogin = async () => {
        try {
            const result = await login({
                email: email.trim().toLowerCase(),
                password
            }).unwrap();

            // Сохраняем токены: Refresh в защищенное хранилище, Access в Redux
            await SecureStore.setItemAsync('refresh_token', result.refresh_token);
            dispatch(setCredentials(result));

        } catch (e) {
            // Если бэкенд прислал JSON с message, выводим его
            const errorMessage = isBackendError(e)
                ? e.data.message
                : 'Не удалось войти. Проверьте соединение.';

            Alert.alert('Ошибка', errorMessage);
        }
    };

    return (
        <View style={styles.form}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={styles.error}>Ошибка авторизации</Text>}

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Войти" onPress={handleLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    form: { gap: 15 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 },
    error: { color: 'red', textAlign: 'center' }
});