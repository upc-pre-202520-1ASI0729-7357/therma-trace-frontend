import { Routes } from '@angular/router';
import { MainLayout } from './shared/presentation/components/main-layout/main-layout';
import { HomeView } from './home/presentation/views/home-view/home-view';
import { ConfigurationView } from './shared/presentation/views/configuration-view/configuration-view';
import { Profile } from './user/presentation/views/profile/profile';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { TemperatureManagement } from './temperature/presentation/view/medicine-management';
import { MedicamentControl } from './medicaments/presentation/views/medicament-control';
import { Login } from './auth/presentation/views/login/login';
import { Register } from './auth/presentation/views/register/register';
import { ForgotPassword } from './auth/presentation/views/forgot-password/forgot-password';

export const routes: Routes = [
  // Default route - redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes (outside MainLayout - no authentication required)
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  // Protected routes (inside MainLayout - will require authentication guard later)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: HomeView },
      { path: 'configuration', component: ConfigurationView },
      { path: 'medicaments', component: MedicamentControl },
      { path: 'temperature', component: TemperatureManagement },
      { path: 'profile', component: Profile }
    ]
  },

  // 404 - must be last
  { path: '**', component: PageNotFound }
];
