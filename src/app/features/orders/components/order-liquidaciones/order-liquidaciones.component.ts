import { Component, OnInit, inject, input, signal, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderService } from '../../../../core/services/sales-order.service';
import { SalesOrderTableComponent } from './components/sales-order-table/sales-order-table.component';
import { PaymentsTableComponent } from './components/payments-table/payments-table.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-order-liquidaciones',
  standalone: true,
  imports: [CommonModule, SalesOrderTableComponent, PaymentsTableComponent, PaymentModalComponent, Button],
  templateUrl: './order-liquidaciones.component.html',
  styleUrl: './order-liquidaciones.component.css'
})
export class OrderLiquidacionesComponent implements OnInit {
  private salesOrderService = inject(SalesOrderService);

  quoteId = input<number | null>(null);
  salesOrderLoaded = output<any>();

  salesOrder = signal<any>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isPaymentModalVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      const id = this.quoteId();
      if (id) {
        this.loadSalesOrder(id);
      }
    });
  }

  ngOnInit(): void {
    const id = this.quoteId();
    if (id) {
      this.loadSalesOrder(id);
    }
  }

  loadSalesOrder(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.salesOrderService.getByQuoteId(id).subscribe({
      next: (data) => {
        this.salesOrder.set(data);
        this.salesOrderLoaded.emit(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching sales order by quote ID:', err);
        this.error.set('No se encontró una orden de venta asociada a esta proforma. Asegúrese de que la proforma esté aprobada.');
        this.loading.set(false);
      }
    });
  }

  onPaymentSaved(): void {
    const id = this.quoteId();
    if (id) {
      this.loadSalesOrder(id);
    }
  }
}
