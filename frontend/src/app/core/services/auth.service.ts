import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../intefaces/auth.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly tokenKey = 'access_token';

    login(credentials: LoginRequest) {
        return this.http
            .post<LoginResponse>(
                `${this.apiUrl}/login`,
                credentials,
            )
            .pipe(
                tap((response) => {
                    localStorage.setItem(
                        this.tokenKey,
                        response.accessToken,
                    );
                }),
            );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);

        void this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}