import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { setCredentials, setInitializing } from '../model/slice';

export const useSession = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            try {
                const refreshToken = await SecureStore.getItemAsync('refresh_token');

                if (refreshToken) {
                    // Пока мы просто восстанавливаем флаг авторизации.
                    // В будущем тут будет вызов RTK Query mutation для рефреша access_token.
                    dispatch(setCredentials({
                        access_token: 'dummy_restore', // Временная заглушка
                        refresh_token: refreshToken
                    }));
                }
            } catch (e) {
                console.error('Session restore failed', e);
            } finally {
                dispatch(setInitializing(false));
            }
        };

        init();
    }, [dispatch]);
};