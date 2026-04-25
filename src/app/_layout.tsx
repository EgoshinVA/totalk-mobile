import {Provider, useSelector} from 'react-redux';
import {Slot} from 'expo-router';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {RootState, store} from '@/app/store';
import {useSession} from '@/entities/session/lib/useSession';
import {colors} from '@/shared/styles';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <SessionProvider>
                <InitialLayout />
            </SessionProvider>
        </Provider>
    );
}

function SessionProvider({ children }: { children: React.ReactNode }) {
    useSession();
    return <>{children}</>;
}

function InitialLayout() {
    const { isInitializing } = useSelector((state: RootState) => state.session);

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
