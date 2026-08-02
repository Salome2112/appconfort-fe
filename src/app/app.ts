import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/navbar/sidebar/sidebar.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule, Button],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
  protected readonly title = signal('appconfort-fe');
  
  // Controla la visibilidad del sidebar
  sidebarHidden = signal(false);

  toggleSidebar(): void {
    this.sidebarHidden.update(hidden => !hidden);
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login') || this.router.url === '/';
  }
}
