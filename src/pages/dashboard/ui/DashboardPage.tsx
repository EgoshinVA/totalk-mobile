import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import * as SecureStore from 'expo-secure-store';
import {logout} from "@/entities/session/model/slice";

export const DashboardPage = () => {
    const dispatch = useDispatch();
    // Позже мы будем брать данные юзера из стора
    const accessToken = useSelector((state: RootState) => state.session.accessToken);

    const handleLogout = async () => {
        // 1. Чистим защищенное хранилище
        await SecureStore.deleteItemAsync('refresh_token');
        // 2. Сбрасываем стейт в Redux (навигатор сам перекинет на Login)
        dispatch(logout());
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <View style={styles.card}>
                    <Text style={styles.cardText}>Ваш токен (первые 20 симв.):</Text>
                    <Text style={styles.tokenHint}>{accessToken?.substring(0, 20)}...</Text>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Выйти из аккаунта</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    welcome: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
    subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 30 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardText: { fontSize: 14, fontWeight: '600', color: '#333' },
    tokenHint: { fontSize: 12, color: '#999', marginTop: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    logoutBtn: { marginTop: 40, padding: 15 },
    logoutText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }
});