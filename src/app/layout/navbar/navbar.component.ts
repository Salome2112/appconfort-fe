import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    menuItems = [
        { label: 'Clientes', path: '/clients', icon: '👥' },
        { label: 'Productos', path: '/products', icon: '🛋️' },
        { label: 'Proformas', path: '/quotes', icon: '📄' },
    ];
}