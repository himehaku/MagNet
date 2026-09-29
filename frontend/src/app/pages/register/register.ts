import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private http = inject(HttpClient);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  message = signal('');
  errorMessage = signal('');
  loading = signal(false);

  register() {
    this.message.set('');
    this.errorMessage.set('');

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.loading.set(true);

    this.http
      .post<RegisterResponse>('http://localhost:3000/users', {
        name: this.name,
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: () => {
          this.message.set('Cuenta creada correctamente.');
          this.errorMessage.set('');

          this.name = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';

          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.errorMessage.set('Ese correo electrónico ya está registrado.');
          } else if (error.status === 400) {
            this.errorMessage.set('Revisa los datos ingresados.');
          } else {
            this.errorMessage.set('No fue posible crear la cuenta.');
          }

          this.loading.set(false);
        }
      });
  }
}