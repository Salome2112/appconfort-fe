import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'clients', pathMatch: 'full' },
    { path: 'clients', loadChildren: () => import('./features/clients/clients.routes').then(r => r.CLIENT_ROUTES) },
    { path: 'products', loadChildren: () => import('./features/products/products.route').then(r => r.PRODUCT_ROUTES) },
    { path: 'quotes', loadChildren: () => import('./features/quotes/quotes.routes').then(r => r.QUOTE_ROUTES) },
];
