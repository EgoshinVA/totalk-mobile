export interface User {
    id: number;
    email: string;
    surName: string;
    name: string;
    patronymic: string;
    avatarURL: string;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterStep1Request {
    email: string;
    password: string;
}

export interface RegisterStep1Response {
    registrationToken: string;
}

export interface RegisterStep2Request {
    registrationToken: string;
    name: string;
    surName: string;
    patronymic?: string;
}

export interface FinalizeRegistrationRequest {
    registrationToken: string;
    avatarUrl?: string;
}

export interface FinalizeRegistrationResponse {
    accessToken: string;
    refreshToken: string;
    user: User
}