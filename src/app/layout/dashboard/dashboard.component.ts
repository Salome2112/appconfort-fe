import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

interface DashboardStats {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

interface RecentOrder {
  id: string;
  client: string;
  product: string;
  amount: number;
  status: 'Completado' | 'Pendiente' | 'Cancelado';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Card, Button, TableModule, Tag],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats: DashboardStats[] = [
    {
      title: 'Ventas Totales',
      value: '$24,500.00',
      icon: 'pi pi-shopping-cart',
      color: 'stat-blue',
      change: '+12% este mes',
      changeType: 'increase'
    },
    {
      title: 'Nuevos Clientes',
      value: '148',
      icon: 'pi pi-users',
      color: 'stat-green',
      change: '+8% esta semana',
      changeType: 'increase'
    },
    {
      title: 'Cotizaciones Activas',
      value: '42',
      icon: 'pi pi-file',
      color: 'stat-orange',
      change: '-3% hoy',
      changeType: 'decrease'
    },
    {
      title: 'Muebles Entregados',
      value: '89',
      icon: 'pi pi-check-circle',
      color: 'stat-purple',
      change: '+15% este mes',
      changeType: 'increase'
    }
  ];

  recentOrders: RecentOrder[] = [
    { id: 'COT-001', client: 'Sofía Rodríguez', product: 'Sofá Modular Confort', amount: 1200.00, status: 'Completado' },
    { id: 'COT-002', client: 'Carlos Mendoza', product: 'Mesa de Comedor Roble', amount: 850.00, status: 'Pendiente' },
    { id: 'COT-003', client: 'Ana María Gómez', product: 'Sillón Reclinable Piel', amount: 650.00, status: 'Completado' },
    { id: 'COT-004', client: 'Luis Fernando Ruiz', product: 'Cama King Size Confort', amount: 1500.00, status: 'Cancelado' },
    { id: 'COT-005', client: 'Valentina Silva', product: 'Juego de Sillas Terraza', amount: 450.00, status: 'Pendiente' }
  ];

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warn';
      case 'Cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
