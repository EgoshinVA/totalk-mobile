import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/shared/api/baseApi';
import sessionReducer from '../../entities/session/model/slice';

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
    if (action.type.endsWith('/pending')) {
        console.log('📡 SENDING REQUEST:', action.meta.arg.endpointName, action.meta.arg.originalArgs);
    }
    if (action.type.endsWith('/fulfilled')) {
        console.log('✅ RESPONSE RECEIVED:', action.payload);
    }
    if (action.type.endsWith('/rejected')) {
        console.warn('❌ REQUEST FAILED:', action.payload || action.error);
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        session: sessionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware, loggerMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;