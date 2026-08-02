import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './payments-table.component.html',
  styleUrl: './payments-table.component.css'
})
export class PaymentsTableComponent {
  payments = input.required<any[]>();

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'CASH':
        return 'Efectivo';
      case 'BANK_TRANSFER':
        return 'Transferencia Bancaria';
      case 'CREDIT_CARD':
        return 'Tarjeta de Crédito';
      case 'DEBIT_CARD':
        return 'Tarjeta de Débito';
      case 'CHECK':
        return 'Cheque';
      default:
        return method;
    }
  }
}
