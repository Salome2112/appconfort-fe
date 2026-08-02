import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-sales-order-table',
  standalone: true,
  imports: [CommonModule, Tag],
  templateUrl: './sales-order-table.component.html',
  styleUrl: './sales-order-table.component.css'
})
export class SalesOrderTableComponent {
  salesOrder = input.required<any>();

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DEPOSIT_PAID':
        return 'info';
      case 'DELIVERED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'VOIDED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'DEPOSIT_PAID':
        return 'Abono Pagado';
      case 'DELIVERED':
        return 'Entregado';
      case 'COMPLETED':
        return 'Completado';
      case 'VOIDED':
        return 'Anulado';
      default:
        return status;
    }
  }
}
