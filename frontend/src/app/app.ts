import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface HealthResponse {
  status: string;
  service: string;
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient);

  protected readonly title = signal('MagNet');
  protected readonly apiStatus = signal('Conectando...');
  protected readonly apiMessage = signal('');

  constructor() {
    this.http
      .get<HealthResponse>('http://localhost:3000/health')
      .subscribe({
        next: (response) => {
          this.apiStatus.set(response.status);
          this.apiMessage.set(response.message);
        },
        error: () => {
          this.apiStatus.set('Error');
          this.apiMessage.set('No se pudo conectar con el backend.');
        }
      });
  }
}