import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';

import { CreateAccountScreen } from '@/screens/create-account-screen/ui/CreateAccountScreen';
import { LoginScreen } from '@/screens/login-screen/ui/LoginScreen';
import { setCredentials } from '@/entities/session/model/slice';
import { isBackendError } from '@/shared/api/isBackendError';
import {ProfileInfoData, ProfileInfoScreen} from "@/screens/create-account-screen/ui/ProfileInfoScreen";
import {useFinalizeRegistrationMutation} from "@/entities/session/api/sessionApi";
import {AvatarScreen} from "@/screens/create-account-screen/ui/AvatarScreen";

type AuthView = 'login' | 'register';
type RegisterStep = 1 | 2 | 3;

const TOTAL_STEPS = 3;

export const AuthPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [view, setView] = useState<AuthView>('login');
    const [step, setStep] = useState<RegisterStep>(1);

    // Накапливаем данные профиля между шагами без лишних ре-рендеров
    const profileData = useRef<ProfileInfoData>({ fullName: '', city: '' });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [finalizeRegistration, { isLoading: isFinalizing }] = useFinalizeRegistrationMutation();

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, [view, step]);

    const goToStep = (next: RegisterStep) => setStep(next);

    const handleStep1Next = () => goToStep(2);

    const handleStep2Next = (data: ProfileInfoData) => {
        profileData.current = data;
        goToStep(3);
    };

    const handleFinalize = async (avatarUri?: string) => {
        try {
            const token = await SecureStore.getItemAsync('registration_token');
            if (!token) throw new Error('Registration token missing');

            const result = await finalizeRegistration({
                registrationToken: token,
                fullName: profileData.current.fullName,
                city: profileData.current.city || undefined,
                avatarUrl: avatarUri,
            }).unwrap();

            await SecureStore.deleteItemAsync('registration_token');
            await SecureStore.setItemAsync('refresh_token', result.refreshToken);
            dispatch(setCredentials(result));

            // replace чтобы нельзя было вернуться назад
            router.replace('//dashboard');
        } catch (e) {
            const message = isBackendError(e) ? e.data.message : 'Could not complete registration. Please try again.';
            Alert.alert('Error', message);
        }
    };

    const renderContent = () => {
        if (view === 'login') {
            return <LoginScreen onCreateAccount={() => { setStep(1); setView('register'); }} />;
        }
        switch (step) {
            case 1:
                return (
                    <CreateAccountScreen
                        onNext={handleStep1Next}
                        onLogIn={() => setView('login')}
                        currentStep={1}
                        totalSteps={TOTAL_STEPS}
                    />
                );
            case 2:
                return (
                    <ProfileInfoScreen
                        onNext={handleStep2Next}
                        onBack={() => goToStep(1)}
                        currentStep={2}
                        totalSteps={TOTAL_STEPS}
                    />
                );
            case 3:
                return (
                    <AvatarScreen
                        onFinish={handleFinalize}
                        onBack={() => goToStep(2)}
                        onSkip={() => handleFinalize(undefined)}
                        currentStep={3}
                        totalSteps={TOTAL_STEPS}
                        isLoading={isFinalizing}
                    />
                );
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {renderContent()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1 } });
