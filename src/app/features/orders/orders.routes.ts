import { Routes } from '@angular/router';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderShellComponent } from './pages/order-shell/order-shell.component';

export const ORDER_ROUTES: Routes = [
    { path: '', component: OrderListComponent },
    { path: 'new', component: OrderShellComponent },
    { path: ':id', component: OrderShellComponent }
];
