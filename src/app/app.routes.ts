import { Routes } from '@angular/router';
import { MainLayout } from './shared/presentation/components/main-layout/main-layout';
import { Home } from './shared/presentation/views/home/home';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { TemperatureManagement } from './temperature/presentation/view/medicine-management';
import { MedicamentControl } from './medicaments/presentation/views/medicament-control';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'medicaments', component: MedicamentControl },
      { path: 'temperature', component: TemperatureManagement },
      { path: '**', component: PageNotFound }
    ]
  }
];
