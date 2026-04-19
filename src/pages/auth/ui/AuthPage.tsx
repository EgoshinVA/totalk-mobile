import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {LoginForm} from "@/features/auth/login/ui/LoginForm";
import {RegisterForm} from "@/features/auth/register/ui/RegisterForm";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        // KeyboardAvoidingView нужен, чтобы клавиатура не закрывала инпуты
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>
                    {isLogin ? 'С возвращением!' : 'Создать аккаунт'}
                </Text>

                {isLogin ? (
                    <LoginForm />
                ) : (
                    <RegisterForm onSuccess={() => setIsLogin(true)} />
                )}

                <TouchableOpacity
                    onPress={() => setIsLogin(!isLogin)}
                    style={styles.switchBtn}
                >
                    <Text style={styles.switchText}>
                        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    switchBtn: { marginTop: 20 },
    switchText: { color: '#007AFF', textAlign: 'center' }
});