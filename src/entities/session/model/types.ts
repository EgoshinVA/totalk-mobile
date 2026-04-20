// Данные пользователя (совпадают с domain.User из Go)
export interface User {
    id: number;
    email: string;
    createdAt: string;
    // Сюда потом добавим ФИО и настройки, как ты планировал
}

// Ответ от сервера при логине/регистрации
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    // Можно также возвращать объект user сразу, если бэкенд это поддерживает
}

// Запрос на логин
export interface LoginRequest {
    email: string;
    password: string;
}

// Запрос на регистрацию
export interface RegisterRequest {
    email: string;
    password: string;
    // Если на бэкенде добавишь поля, обновишь и здесь
}

// Структура самого стейта в Redux
export interface SessionState {
    user: User | null;
    accessToken: string | null;
    isAuthorized: boolean;
    isInitializing: boolean; // Чтобы показать сплэш-скрин, пока грузим токены из памяти
}

export interface RegisterStep1Request {
    email: string;
    password: string;
}

export interface RegisterStep1Response {
    // Временный токен для завершения регистрации
    registrationToken: string;
}

export interface FinalizeRegistrationRequest {
    registrationToken: string;
    fullName: string;
    city?: string;
    avatarUrl?: string;
}

export interface FinalizeRegistrationResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        city?: string;
        avatarUrl?: string;
    };
}