import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { RootState } from '@/app/store';
import { logout, updateTokens } from '@/entities/session/model/slice';
import Constants from 'expo-constants';

const baseUrl = Constants.expoConfig?.extra?.BASE_API as string;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).session.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const getFullUrl = (args: string | FetchArgs): string => {
    if (typeof args === 'string') return `${baseUrl}${args}`;
    let fullUrl = `${baseUrl}${args.url}`;
    if (args.params) {
        const searchParams = new URLSearchParams();
        Object.entries(args.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const qs = searchParams.toString();
        if (qs) fullUrl += `?${qs}`;
    }
    return fullUrl;
};

// Флаг чтобы не запускать несколько параллельных рефрешей
let isRefreshing = false;

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');
    const fullUrl = getFullUrl(args);

    let result = await baseQuery(args, api, extraOptions);

    // Проверяем 401 и следим, чтобы это не был сам запрос рефреша (избегаем петли)
    const isRefreshRequest = typeof args !== 'string' && args.url.includes('/auth/refresh');

    if (result.error?.status === 401 && !isRefreshing && !isRefreshRequest) {
        isRefreshing = true;
        try {
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

            if (!storedRefreshToken) {
                api.dispatch(logout());
                return result;
            }

            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken: storedRefreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const data = refreshResult.data as { accessToken: string; refreshToken: string };

                await SecureStore.setItemAsync('refreshToken', data.refreshToken);
                api.dispatch(updateTokens({ accessToken: data.accessToken }));

                // Повторяем исходный запрос с новым токеном
                result = await baseQuery(args, api, extraOptions);
            } else if (refreshResult.error?.status === 401) {
                console.log('Refresh token invalid, logging out...');
                await SecureStore.deleteItemAsync('refreshToken');
                api.dispatch(logout());
            } else {
                console.warn('Refresh failed due to network/server error. Keeping session.');
            }
        } finally {
            isRefreshing = false;
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Task'],
    endpoints: () => ({}),
});