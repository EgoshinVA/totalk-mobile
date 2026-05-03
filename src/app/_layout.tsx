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
            <PersistGate
                loading={
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={colors.accent}/>
                    </View>
                }
                persistor={persistor}
            >
                <SessionProvider>
                    <InitialLayout/>
                </SessionProvider>
            </PersistGate>
        </Provider>
    );
}

function SessionProvider({children}: { children: React.ReactNode }) {
    useSession();
    return <>{children}</>;
}

function InitialLayout() {
    const { isInitializing, isAuthorized } = useSelector((state: RootState) => state.session);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isInitializing) return;

        const currentSegments = segments as string[];
        const inAuthGroup = currentSegments[0] === '(auth)';
        const atRoot = currentSegments.length === 0;

        // Не залогинен и пытается попасть в защищенные разделы
        if (!isAuthorized && !inAuthGroup) {
            router.replace('/'); // Перенаправляем на корневой путь
        }
        // Залогинен и находится в auth группе или на корне
        else if (isAuthorized && (inAuthGroup || atRoot)) {
            router.replace('/(dashboard)');
        }
    }, [isAuthorized, isInitializing, segments]);

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
    root: {flex: 1, backgroundColor: colors.background},
    loader: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
