import {baseApi} from '@/shared/api/baseApi';
import {
    AuthResponse,
    FinalizeRegistrationRequest,
    FinalizeRegistrationResponse,
    LoginRequest,
    RegisterStep1Request,
    RegisterStep1Response
} from '../model/types';

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Вход в аккаунт
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Получение токена при вводе email и пароля
        registerStep1: builder.mutation<RegisterStep1Response, RegisterStep1Request>({
            query: body => ({
                url: '/auth/register/step1',
                method: 'POST',
                body,
            }),
        }),

        // Финальный шаг — отправляем профиль с временным токеном
        finalizeRegistration: builder.mutation<FinalizeRegistrationResponse, FinalizeRegistrationRequest>({
            query: body => ({
                url: '/auth/register/finalize',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {useLoginMutation, useRegisterStep1Mutation, useFinalizeRegistrationMutation} = sessionApi;