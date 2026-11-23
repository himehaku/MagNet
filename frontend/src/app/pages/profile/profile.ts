import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';

interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  location: string | null;
  skills: string[];
  interests: string[];
  experienceYears: number;
  preferredRemote: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  cvAnalyzing = signal(false);
  cvFileName = signal('');
  cvDetectedSkills = signal<string[]>([]);
  cvMessage = signal('');  

  name = signal('');
  email = signal('');

  loading = signal(true);
  saving = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  profileForm = this.fb.nonNullable.group({
    location: [''],
    skills: [''],
    interests: [''],
    experienceYears: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(60),
      ],
    ],
    preferredRemote: [false],
  });

  constructor() {
    this.loadProfile();
  }

  analyzeCv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      this.cvMessage.set('Selecciona un archivo PDF.');
      input.value = '';
      return;
    }

    const headers = this.getHeaders();

    if (!headers) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.cvAnalyzing.set(true);
    this.cvMessage.set('');
    this.cvDetectedSkills.set([]);
    this.cvFileName.set(file.name);

    this.http
      .post<{
        filename: string;
        skills: string[];
        skills_count: number;
        requires_confirmation: boolean;
      }>(
        `${environment.apiUrl}/auth/profile/cv`,
        formData,
        { headers },
      )
      .subscribe({
        next: (response) => {
          this.cvDetectedSkills.set(response.skills);

          this.cvMessage.set(
            `${response.skills_count} habilidades detectadas. Revísalas antes de agregarlas.`,
          );

          this.cvAnalyzing.set(false);
        },
        error: () => {
          this.cvMessage.set(
            'No fue posible analizar el CV.',
          );

          this.cvAnalyzing.set(false);
        },
      });
  }  

  private getHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.router.navigate(['/login']);
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  addDetectedSkills(): void {
    const currentSkills =
      this.parseList(
        this.profileForm.controls.skills.value,
      );

    const combined = Array.from(
      new Set([
        ...currentSkills,
        ...this.cvDetectedSkills(),
      ]),
    );

    this.profileForm.controls.skills.setValue(
      combined.join(', '),
    );

    this.cvMessage.set(
      'Habilidades agregadas al formulario. Guarda el perfil para confirmar los cambios.',
    );

    this.cvDetectedSkills.set([]);
  }

  private loadProfile(): void {
    const headers = this.getHeaders();

    if (!headers) {
      return;
    }

    this.http
      .get<ProfileResponse>(
        `${environment.apiUrl}/auth/profile`,
        { headers },
      )
      .subscribe({
        next: (profile) => {
          this.name.set(profile.name);
          this.email.set(profile.email);

          this.profileForm.patchValue({
            location: profile.location ?? '',
            skills: profile.skills.join(', '),
            interests: profile.interests.join(', '),
            experienceYears: profile.experienceYears,
            preferredRemote: profile.preferredRemote,
          });

          this.loading.set(false);
        },
        error: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');

          this.router.navigate(['/login']);
        },
      });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const headers = this.getHeaders();

    if (!headers) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const value = this.profileForm.getRawValue();

    const body = {
      location: value.location.trim(),
      skills: this.parseList(value.skills),
      interests: this.parseList(value.interests),
      experienceYears: value.experienceYears,
      preferredRemote: value.preferredRemote,
    };

    this.http
      .patch<ProfileResponse>(
        `${environment.apiUrl}/auth/profile`,
        body,
        { headers },
      )
      .subscribe({
        next: (profile) => {
          this.profileForm.patchValue({
            location: profile.location ?? '',
            skills: profile.skills.join(', '),
            interests: profile.interests.join(', '),
            experienceYears: profile.experienceYears,
            preferredRemote: profile.preferredRemote,
          });

          this.successMessage.set(
            'Perfil actualizado correctamente.',
          );

          this.saving.set(false);
        },
        error: () => {
          this.errorMessage.set(
            'No se pudo actualizar el perfil.',
          );

          this.saving.set(false);
        },
      });
  }

  private parseList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}