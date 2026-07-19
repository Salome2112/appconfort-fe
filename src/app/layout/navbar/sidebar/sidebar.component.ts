import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
    label: string;
    path: string;
    icon: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    isExpanded = signal(true);

    menuItems: MenuItem[] = [
        { label: 'Clientes', path: '/clients', icon: '👥' },
        { label: 'Productos', path: '/products', icon: '🛋️' },
        { label: 'Proformas', path: '/quotes', icon: '📄' },
    ];

    toggle(): void {
        this.isExpanded.update(v => !v);
    }
}