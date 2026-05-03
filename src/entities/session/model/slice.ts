import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from "@/entities/session/model/types";

interface SessionState {
    accessToken: string | null;
    user: User | null;
    isAuthorized: boolean;
    isInitializing: boolean;
}

const initialState: SessionState = {
    accessToken: null,
    user: null,
    isAuthorized: false,
    isInitializing: true,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        // Логин и финализация регистрации — приходит всё: токены + юзер
        setCredentials(state, action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            user: User;
        }>) {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.isAuthorized = true;
        },

        // Рефреш — только обновляем токен, user не трогаем
        updateTokens(state, action: PayloadAction<{ accessToken: string }>) {
            state.accessToken = action.payload.accessToken;
        },

        updateUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },

        logout(state) {
            state.accessToken = null;
            state.user = null;
            state.isAuthorized = false;
        },

        setInitializing(state, action: PayloadAction<boolean>) {
            state.isInitializing = action.payload;
        },
    },
});

export const { setCredentials, updateTokens, logout, setInitializing, updateUser } = sessionSlice.actions;
export default sessionSlice.reducer;