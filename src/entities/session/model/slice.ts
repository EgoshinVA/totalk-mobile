import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthResponse, SessionState} from './types';

const initialState: SessionState = {
    user: null,
    accessToken: null,
    isAuthorized: false,
    isInitializing: true,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        // Вызывается при успешном логине
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthorized = true;
            // В реальном приложении здесь можно также декодировать JWT для получения ID
        },
        // Вызывается при загрузке приложения
        setInitializing: (state, action: PayloadAction<boolean>) => {
            state.isInitializing = action.payload;
        },
        // Выход из системы
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthorized = false;
        },
    },
});

export const {setCredentials, logout, setInitializing} = sessionSlice.actions;
export default sessionSlice.reducer;