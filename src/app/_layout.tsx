import {Provider, useSelector} from 'react-redux';
import {Slot, useRouter, useSegments} from 'expo-router';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {persistor, RootState, store} from '@/app/store';
import {useSession} from '@/entities/session/lib/useSession';
import {colors} from '@/shared/styles';
import {PersistGate} from "redux-persist/integration/react";
import {useEffect} from "react";

export default function RootLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SessionProvider>
                    <InitialLayout />
                </SessionProvider>
            </PersistGate>
        </Provider>
    );
}

function SessionProvider({ children }: { children: React.ReactNode }) {
    useSession();
    return <>{children}</>;
}

function InitialLayout() {
    const { isInitializing, isAuthorized } = useSelector((state: RootState) => state.session);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isInitializing) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthorized && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (isAuthorized && inAuthGroup) {
            router.replace('/(dashboard)');
        }
    }, [isAuthorized, isInitializing]);

    if (isInitializing) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    loader: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
