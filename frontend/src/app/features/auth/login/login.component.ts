import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../../core/interfaces/auth.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
      ],
    ],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor complete todos los campos correctamente.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginRequest =
      this.loginForm.getRawValue();

    this.authService
      .login(credentials)
      .subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);

          this.isLoading.set(false);

          void this.router.navigateByUrl('/dashboard', {
            replaceUrl: true,
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Inicio de sesión fallido:', error);

          this.isLoading.set(false);

          if (error.status === 401) {
            this.errorMessage.set(
              'Correo electrónico o contraseña incorrectos.',
            );
            return;
          }

          if (error.status === 0) {
            this.errorMessage.set(
              'No se pudo conectar con el servidor.',
            );
            return;
          }

          this.errorMessage.set(
            'Ocurrió un error al iniciar sesión.',
          );
        },
      });
  }
}