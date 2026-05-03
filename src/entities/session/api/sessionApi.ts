import { baseApi } from '@/shared/api/baseApi';
import {
    AuthResponse,
    FinalizeRegistrationRequest,
    FinalizeRegistrationResponse,
    LoginRequest,
    RegisterStep1Request,
    RegisterStep1Response,
    RegisterStep2Request,
    User,
} from '../model/types';

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        refresh: builder.mutation<RefreshResponse, { refreshToken: string }>({
            query: (body) => ({
                url: '/auth/refresh',
                method: 'POST',
                body,
            }),
        }),

        // Восстанавливает юзера после рефреша при перезаходе
        me: builder.query<User, void>({
            query: () => '/auth/me',
        }),

        updateMe: builder.mutation<User, {
            name?: string;
            surName?: string;
            patronymic?: string;
            avatarUrl?: string;
        }>({
            query: (body) => ({ url: '/auth/me', method: 'PATCH', body }),
            invalidatesTags: ['User'],
        }),

        registerStep1: builder.mutation<RegisterStep1Response, RegisterStep1Request>({
            query: (body) => ({
                url: '/auth/register/step1',
                method: 'POST',
                body,
            }),
        }),

        registerStep2: builder.mutation<void, RegisterStep2Request>({
            query: (body) => ({
                url: '/auth/register/step2',
                method: 'POST',
                body,
            }),
        }),

        finalizeRegistration: builder.mutation<FinalizeRegistrationResponse, FinalizeRegistrationRequest>({
            query: (body) => ({
                url: '/auth/register/step3',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshMutation,
    useMeQuery,
    useUpdateMeMutation,
    useLazyMeQuery,
    useRegisterStep1Mutation,
    useRegisterStep2Mutation,
    useFinalizeRegistrationMutation,
} = sessionApi;