import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { HomePage } from '@/pages/home/ui/HomePage';
import { RootState } from '@/app/store';

export default function MainScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { isAuthorized, isInitializing } = useSelector(
        (state: RootState) => state.session
    );

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    // Если сессия восстановилась — сразу на дашборд, не ждём нажатия
    useEffect(() => {
        if (!isInitializing && isAuthorized) {
            router.replace('/(dashboard)');
        }
    }, [isAuthorized, isInitializing]);

    const handleStartClick = () => {
        // На случай если пользователь нажал до окончания инициализации
        if (isAuthorized) {
            router.replace('/(dashboard)');
        } else {
            router.push('/(auth)/login');
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <HomePage onGetStarted={handleStartClick} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});