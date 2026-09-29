import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface ProfileResponse {
  userId: number;
  email: string;
}

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = signal('');
  errorMessage = signal('');

  constructor() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<ProfileResponse>('http://localhost:3000/auth/profile', {
        headers
      })
      .subscribe({
        next: (response) => {
          this.email.set(response.email);
        },
        error: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');

          this.router.navigate(['/login']);
        }
      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}