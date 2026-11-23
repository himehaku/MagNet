import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  readonly userName: string;

  constructor(private readonly router: Router) {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        this.userName =
          JSON.parse(storedUser).name ?? 'Usuario';
      } catch {
        this.userName = 'Usuario';
      }
    } else {
      this.userName = 'Invitado';
    }
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}