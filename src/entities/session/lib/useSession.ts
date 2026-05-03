import { useEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { setCredentials, updateTokens, logout, setInitializing } from '@/entities/session/model/slice';
import { useRefreshMutation, useLazyMeQuery } from '@/entities/session/api/sessionApi';
import {RootState} from "@/app/store";

export function useSession() {
    const dispatch = useDispatch();
    const initializedRef = useRef(false);
    const { isAuthorized } = useSelector((state: RootState) => state.session);

    const [refresh] = useRefreshMutation();
    const [fetchMe] = useLazyMeQuery();

    useEffect(() => {
        // Если уже инициализировано ИЛИ уже авторизовано — выходим
        if (initializedRef.current || isAuthorized) return;
        initializedRef.current = true;

        const initialize = async () => {
            dispatch(setInitializing(true));
            try {
                const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

                if (!storedRefreshToken) {
                    dispatch(logout());
                    return;
                }

                // Шаг 1 — рефреш
                const tokenResult = await refresh({ refreshToken: storedRefreshToken }).unwrap();
                await SecureStore.setItemAsync('refreshToken', tokenResult.refreshToken);

                // Шаг 2 — кладём accessToken в Redux
                dispatch(updateTokens({ accessToken: tokenResult.accessToken }));

                // Шаг 3 — получаем юзера
                const user = await fetchMe(undefined, true).unwrap();

                // Шаг 4 — финально всё в Redux, isAuthorized = true
                dispatch(setCredentials({
                    accessToken: tokenResult.accessToken,
                    refreshToken: tokenResult.refreshToken,
                    user,
                }));
            } catch (e: any) {
                // Проверяем, что это ошибка от RTK Query и статус именно 401
                const isUnauthorized = e?.status === 401 || e?.data?.status === 401;

                if (isUnauthorized) {
                    console.log('Сессия истекла, выходим...');
                    await SecureStore.deleteItemAsync('refreshToken');
                    dispatch(logout());
                } else {
                    console.warn('Ошибка при инициализации сессии (не 401):', e);
                }
            } finally {
                dispatch(setInitializing(false));
            }
        };

        initialize();
    }, []);
}