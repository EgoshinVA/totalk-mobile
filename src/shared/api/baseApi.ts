import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import {RootState} from "@/app/store";
import {logout, setCredentials} from "@/entities/session/model/slice";

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://192.168.31.88:8080/api/v1',
    prepareHeaders: (headers, { getState }) => {
        // Берем токен из памяти (Redux), это мгновенно
        const token = (getState() as RootState).session.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Если получили 401 — значит access_token всё
    if (result.error && result.error.status === 401) {
        console.log('Access token expired, trying to refresh...');

        // Достаем refresh_token из защищенного хранилища
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (refreshToken) {
            // Делаем запрос на обновление (используем fetch, чтобы не зациклиться)
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                // Бэк вернул новые токены!
                // Сохраняем их в Redux и SecureStore (через твой экшен)
                const data = refreshResult.data as { access_token: string; refresh_token: string };
                api.dispatch(setCredentials(data));

                // Повторяем изначальный запрос, который упал с 401
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Рефреш тоже не удался (например, протух совсем)
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: () => ({}),
});