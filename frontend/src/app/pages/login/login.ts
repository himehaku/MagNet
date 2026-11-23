import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  login() {
    this.errorMessage.set('');

    if (!this.email || !this.password) {
      this.errorMessage.set('Completa todos los campos.');
      return;
    }

    this.loading.set(true);

    this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.loading.set(false);

          this.router.navigate(['/app/profile']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage.set('Correo o contraseña incorrectos.');
          } else {
            this.errorMessage.set('No fue posible iniciar sesión.');
          }

          this.loading.set(false);
        }
      });
  }
}