import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface HealthResponse {
  status: string;
  service: string;
  message: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private http = inject(HttpClient);

  protected readonly title = signal('MagNet');
  protected readonly apiStatus = signal('Conectando...');
  protected readonly apiMessage = signal('');

  constructor() {
    this.http
      .get<HealthResponse>(`${environment.apiUrl}/health`)
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