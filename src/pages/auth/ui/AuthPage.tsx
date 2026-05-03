import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Alert} from 'react-native';
import {useRouter} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {useDispatch} from 'react-redux';

import {CreateAccountScreen} from '@/screens/create-account-screen/ui/CreateAccountScreen';
import {LoginScreen} from '@/screens/login-screen/ui/LoginScreen';
import {setCredentials} from '@/entities/session/model/slice';
import {isBackendError} from '@/shared/api/isBackendError';
import {ProfileInfoScreen} from "@/screens/create-account-screen/ui/ProfileInfoScreen";
import {useFinalizeRegistrationMutation, useRegisterStep2Mutation} from "@/entities/session/api/sessionApi";
import {AvatarScreen} from "@/screens/create-account-screen/ui/AvatarScreen";
import {ProfileInfoData} from "@/screens/create-account-screen/lib/.schema";

type AuthView = 'login' | 'register';
type RegisterStep = 1 | 2 | 3;

const TOTAL_STEPS = 3;

export const AuthPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [view, setView] = useState<AuthView>('login');
    const [step, setStep] = useState<RegisterStep>(1);

    // Накапливаем данные профиля между шагами без лишних ре-рендеров
    const profileData = useRef<ProfileInfoData>({name: '', surName: '', patronymic: ''});

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [registerStep2, {isLoading}] = useRegisterStep2Mutation();
    const [finalizeRegistration, {isLoading: isFinalizing}] = useFinalizeRegistrationMutation();

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {toValue: 1, duration: 400, useNativeDriver: true}).start();
    }, [view, step]);

    const goToStep = (next: RegisterStep) => setStep(next);

    const handleStep1Next = () => goToStep(2);

    const handleStep2Next = async (data: ProfileInfoData) => {
        try {
            profileData.current = data;
            const token = await SecureStore.getItemAsync('registration_token');
            if (!token) throw new Error('Registration token missing');

            await registerStep2({
                registrationToken: token,
                name: data.name,
                surName: data.surName,
                patronymic: data.patronymic,
            }).unwrap();
            goToStep(3);
        } catch (e) {
            const message = isBackendError(e) ? e.data.message : 'Could not complete registration. Please try again.';
            Alert.alert('Error', message);
        }
    };

    const handleFinalize = async (avatarUri?: string) => {
        try {
            const token = await SecureStore.getItemAsync('registration_token');
            if (!token) throw new Error('Registration token missing');

            const result = await finalizeRegistration({
                registrationToken: token,
                avatarUrl: avatarUri,
            }).unwrap();

            await SecureStore.deleteItemAsync('registration_token');
            await SecureStore.setItemAsync('refreshToken', result.refreshToken);
            dispatch(setCredentials(result));

            // replace чтобы нельзя было вернуться назад
            router.replace('/(dashboard)');
        } catch (e) {
            const message = isBackendError(e) ? e.data.message : 'Could not complete registration. Please try again.';
            Alert.alert('Error', message);
        }
    };

    const renderContent = () => {
        if (view === 'login') {
            return <LoginScreen onCreateAccount={() => {
                setStep(1);
                setView('register');
            }}/>;
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
                        isLoading={isLoading}
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
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            {renderContent()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({container: {flex: 1}});
