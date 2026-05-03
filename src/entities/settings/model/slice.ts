import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

interface SettingsState {
    reminderOffset: number | null;
    language: string;
    notificationsEnabled: boolean;
}

const initialState: SettingsState = {
    reminderOffset: 5,
    language: 'en',
    notificationsEnabled: true,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setReminderOffset(state, action: PayloadAction<number | null>) {
            state.reminderOffset = action.payload;
        },
        setLanguage(state, action: PayloadAction<string>) {
            state.language = action.payload;
        },
        setNotificationsEnabled(state, action: PayloadAction<boolean>) {
            state.notificationsEnabled = action.payload;
        },
    },
});

export const { setReminderOffset, setLanguage, setNotificationsEnabled } = settingsSlice.actions;

const persistConfig = {
    key: 'settings',
    storage: AsyncStorage,
    timeout: 0,
};

export const settingsReducer = persistReducer(persistConfig, settingsSlice.reducer);