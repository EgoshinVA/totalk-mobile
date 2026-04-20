import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { HomePage } from "@/pages/home/ui/HomePage";
import { useRouter } from "expo-router";

export default function MainScreen() {
    const router = useRouter();

    // Значение для прозрачности (от 0 до 1)
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleStartClick = () => {
        router.push('/(auth)/login');
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <HomePage onGetStarted={handleStartClick}/>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});