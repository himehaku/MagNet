import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { JobsPage } from './pages/jobs/jobs';

import { AppShell } from './layouts/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'app',
    component: AppShell,
    children: [
      {
        path: 'jobs',
        component: JobsPage,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'jobs',
    redirectTo: 'app/jobs',
    pathMatch: 'full',
  },

  {
    path: 'profile',
    redirectTo: 'app/profile',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: '',
  },
];