import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'clients', loadChildren: () => import('./features/clients/clients.routes').then(r => r.CLIENT_ROUTES) },
    { path: 'products', loadChildren: () => import('./features/products/products.route').then(r => r.PRODUCT_ROUTES) },
    { path: 'quotes', loadChildren: () => import('./features/quotes/quotes.routes').then(r => r.QUOTE_ROUTES) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'dashboard', loadComponent: () => import('./layout/dashboard/dashboard.component').then(m => m.DashboardComponent) },
];
