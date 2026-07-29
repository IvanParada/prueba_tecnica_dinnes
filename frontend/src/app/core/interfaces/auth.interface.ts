export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    email: string;
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}