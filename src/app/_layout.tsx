import { Provider, useSelector } from 'react-redux';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {RootState, store} from "@/app/store";
import {useSession} from "@/entities/session/lib/useSession";
import {colors} from "@/shared/styles";

export default function RootLayout() {
    return (
        <Provider store={store}>
            <InitialLayout />
        </Provider>
    );
}

function InitialLayout() {
    const segments = useSegments();
    const router = useRouter();

    useSession();

    const { isAuthorized, isInitializing } = useSelector((state: RootState) => state.session);

    useEffect(() => {
        if (isInitializing) return;

        const rootSegment = segments[0];
        const inAuthGroup = rootSegment === '(auth)';
        const inDashboardGroup = rootSegment === '(dashboard)';
        const isLandingPage = (segments[0] as string) === "index";

        if (!isAuthorized) {
            // Если НЕ залогинен:
            // Выкидываем только из закрытых разделов.
            // На лендинге (isLandingPage) оставляем как есть.
            if (inDashboardGroup) {
                router.replace('/(auth)/login');
            }
        } else {
            // Если ЗАЛОГИНЕН:
            // Не даем смотреть лендинг или форму логина — гоним в работу.
            if (inAuthGroup || isLandingPage) {
                router.replace('/(dashboard)');
            }
        }
    }, [isAuthorized, segments, isInitializing]);

    if (isInitializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Slot />
        </View>
    );
}