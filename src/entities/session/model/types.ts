// Данные пользователя (совпадают с domain.User из Go)
export interface User {
    id: number;
    email: string;
    createdAt: string;
    // Сюда потом добавим ФИО и настройки, как ты планировал
}

// Ответ от сервера при логине/регистрации
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
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