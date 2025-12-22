import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { LayoutComponent } from './components/layout/layout';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin';
import { DashboardRmComponent } from './components/dashboard-rm/dashboard-rm';
import { DashboardAnalystComponent } from './components/dashboard-analyst/dashboard-analyst';
import { CreditRequestListComponent } from './components/credit-request-list/credit-request-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        component: DashboardAdminComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // === RM ROUTES ===
      {
        path: 'rm',
        redirectTo: 'rm/clients',
        pathMatch: 'full'
      },
      {
        path: 'rm/clients',
        component: DashboardRmComponent,
        canActivate: [roleGuard],
        data: { roles: ['RM'] }
      },
      {
        path: 'rm/credit-requests',
        component: CreditRequestListComponent,
        canActivate: [roleGuard],
        data: { roles: ['RM'] }
      },

      // === ANALYST ROUTES ===
      {
        path: 'analyst',
        component: DashboardAnalystComponent,
        canActivate: [roleGuard],
        data: { roles: ['ANALYST'] }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
