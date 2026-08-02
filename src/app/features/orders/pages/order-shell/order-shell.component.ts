import { Component, inject, signal, OnInit, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Steps } from 'primeng/steps';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CustomerSearchModalComponent } from './components/customer-search-modal/customer-search-modal.component';
import { Client } from '../../../../shared/models/client.model';
import { OrderQuoteStepComponent } from '../../components/order-quote-step/order-quote-step.component';
import { QuoteService } from '../../../../core/services/quote.service';
import { CustomStepperComponent, StepItem } from './components/custom-stepper/custom-stepper.component';
import { OrderLiquidacionesComponent } from '../../components/order-liquidaciones/order-liquidaciones.component';
import { SalesOrderService } from '../../../../core/services/sales-order.service';

@Component({
  selector: 'app-order-shell',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    Steps,
    Card,
    Button,
    Tag,
    SplitButton,
    CustomerSearchModalComponent,
    OrderQuoteStepComponent,
    CustomStepperComponent,
    OrderLiquidacionesComponent,
    Toast
  ],
  templateUrl: './order-shell.component.html',
  styleUrl: './order-shell.component.css'
})
export class OrderShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quoteService = inject(QuoteService);
  private messageService = inject(MessageService);
  private salesOrderService = inject(SalesOrderService);

  liquidacionesComponent = viewChild(OrderLiquidacionesComponent);

  quoteId = signal<number | null>(null);
  quoteStatus = signal<string>('DRAFT');
  salesOrderStatus = signal<string | null>(null);
  salesOrderId = signal<number | null>(null);
  // Información de ejemplo del pedido
  orderId = signal<string>('PED-1082');
  clientName = signal<string>('Juan Pérez');
  productName = signal<string>('Closet Modular');

  currentStepIndex = signal<number>(0); // Iniciamos en Proforma (Paso 1, índice 0)

  // Estados del pago / cliente
  selectedClient = signal<Client | null>(null);
  isOpenClientSearch = signal<boolean>(false);
  total = signal<number>(0);
  selectedPaymentMethod = signal<string>('Pago Completado');

  stepItems: MenuItem[] = [
    { label: 'Proforma', icon: 'pi pi-file' },
    { label: 'Liquidación', icon: 'pi pi-wallet' },
    { label: 'Taller', icon: 'pi pi-cog' }
  ];

  customSteps = computed<StepItem[]>(() => {
    const active = this.currentStepIndex();
    const status = this.quoteStatus();

    const proformaBadgeMap: Record<string, { label: string, severity: string }> = {
      'DRAFT': { label: 'Borrador', severity: 'info' },
      'SENT': { label: 'Enviada', severity: 'success' },
      'ACCEPTED': { label: 'Aprobada', severity: 'success' },
      'REJECTED': { label: 'Rechazada', severity: 'danger' }
    };

    const proformaStatus = proformaBadgeMap[status] || { label: 'Borrador', severity: 'info' };

    const salesStatus = this.salesOrderStatus();
    const liquidacionLabels: Record<string, string> = {
      'PENDING': 'Por Pagar',
      'DEPOSIT_PAID': 'Abonado',
      'DELIVERED': 'Entregado',
      'COMPLETED': 'Completado',
      'VOIDED': 'Anulado'
    };
    const liquidacionBadge = salesStatus ? (liquidacionLabels[salesStatus] || salesStatus) : (active === 1 ? 'Activo' : (active > 1 ? 'Listo' : 'Pendiente'));
    const liquidacionSeverity = salesStatus ? (salesStatus === 'VOIDED' ? 'danger' : (salesStatus === 'COMPLETED' || salesStatus === 'DELIVERED' ? 'success' : 'info')) : (active === 1 ? 'info' : (active > 1 ? 'success' : 'warn'));

    return [
      {
        label: 'Proforma',
        key: 'A',
        badge: proformaStatus.label,
        badgeSeverity: proformaStatus.severity
      },
      {
        label: 'Liquidación',
        key: 'B',
        badge: liquidacionBadge,
        badgeSeverity: liquidacionSeverity,
        disabled: status === 'DRAFT'
      },
      {
        label: 'Fábrica / Taller',
        key: 'C',
        badge: active === 2 ? 'Activo' : 'Pendiente',
        badgeSeverity: active === 2 ? 'info' : 'warn',
        disabled: status === 'DRAFT' || status === 'SENT' || status === 'REJECTED'
      }
    ];
  });

  confirmActionItems: MenuItem[] = [
    {
      label: 'Enviar',
      icon: 'pi pi-send',
      command: () => {
        window.open('https://api.whatsapp.com/send?phone=593988963746', '_blank');
        this.quoteStatus.set('SENT');
        const id = this.quoteId();
        if (id) {
          this.quoteService.updateStatus(id, 'SENT').subscribe({
            next: (updatedQuote) => console.log('Status updated to SENT:', updatedQuote),
            error: (err) => console.error('Error updating status to SENT:', err)
          });
        }
      }
    },
    {
      label: 'No aprobada',
      icon: 'pi pi-thumbs-down',
      command: () => {
        if (this.quoteStatus() !== 'SENT') {
          this.messageService.add({
            severity: 'warn',
            summary: 'Acción Requerida',
            detail: 'Por favor, primero envíe la proforma al cliente antes de rechazarla.'
          });
          return;
        }
        this.quoteStatus.set('REJECTED');
        const id = this.quoteId();
        if (id) {
          this.quoteService.updateStatus(id, 'REJECTED').subscribe({
            next: (updatedQuote) => console.log('Status updated to REJECTED:', updatedQuote),
            error: (err) => console.error('Error updating status to REJECTED:', err)
          });
        }
      }
    }
  ];

  paymentActionItems: MenuItem[] = [
    {
      label: 'Registrar Pago',
      icon: 'pi pi-plus',
      command: () => {
        this.liquidacionesComponent()?.isPaymentModalVisible.set(true);
      }
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.quoteId.set(Number(id));
        if (id.startsWith('PED-') || id.includes('-')) {
          this.orderId.set(id);
        } else {
          this.orderId.set('PED-' + id);
        }

        this.quoteService.getById(Number(id)).subscribe({
          next: (quote) => {
            this.clientName.set(`${quote.client.firstName} ${quote.client.lastName}`);
            this.selectedClient.set(quote.client);
            this.quoteStatus.set(quote.status);
            this.salesOrderStatus.set(quote.salesOrder?.status || null);
            this.salesOrderId.set(quote.salesOrder?.id || null);

            // Redireccionar al paso según el estado cargado
            if (quote.status === 'ACCEPTED') {
              this.currentStepIndex.set(1);
            } else {
              this.currentStepIndex.set(0);
            }
          },
          error: (err) => console.error('Error loading order/quote in shell:', err)
        });
      } else {
        this.quoteId.set(null);
        this.orderId.set('PED-Nuevo');
        this.clientName.set('Sin Asignar');
        this.selectedClient.set(null);
        this.currentStepIndex.set(0); // Comienza en Paso 1 (Proforma) para crear el pedido
      }
    });
  }

  nextStep(): void {
    if (this.currentStepIndex() < 2) {
      this.currentStepIndex.update(idx => idx + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(idx => idx - 1);
    }
  }

  openClientSearch(): void {
    this.isOpenClientSearch.set(true);
  }

  onClientSelected(client: Client): void {
    this.selectedClient.set(client);
    this.isOpenClientSearch.set(false);

    // Si es un pedido nuevo, creamos la proforma
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === 'new') {
      this.quoteService.create({ clientId: client.id }).subscribe({
        next: (quote) => {
          // Redireccionar al ID de la proforma creada
          this.router.navigate(['/orders', quote.id]);
        },
        error: (err) => console.error('Error al crear proforma:', err)
      });
    }
  }

  seleccionarMetodo(metodo: string): void {
    this.selectedPaymentMethod.set(`Pagar con ${metodo}`);
  }

  onConfirmarPago(): void {
    const orderId = this.salesOrderId();
    if (!orderId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay una orden de venta activa para completar.'
      });
      return;
    }

    this.salesOrderService.complete(orderId).subscribe({
      next: (updatedOrder) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Orden Completada',
          detail: 'La orden de venta ha sido completada exitosamente.'
        });
        this.salesOrderStatus.set(updatedOrder.status);
        const quoteId = this.quoteId();
        if (quoteId) {
          this.liquidacionesComponent()?.loadSalesOrder(quoteId);
        }
      },
      error: (err) => {
        console.error('Error completing sales order:', err);
        const errMsg = err.error?.message || 'No se puede completar la orden de venta.';
        this.messageService.add({
          severity: 'warn',
          summary: 'Saldo Pendiente',
          detail: `${errMsg}`
        });
      }
    });
  }

  onConfirmar(): void {
    if (this.quoteStatus() !== 'SENT') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción Requerida',
        detail: 'Por favor, primero envíe la proforma al cliente antes de aprobarla.'
      });
      return;
    }
    this.quoteStatus.set('ACCEPTED');
    const id = this.quoteId();
    if (id) {
      this.quoteService.updateStatus(id, 'ACCEPTED').subscribe({
        next: (updatedQuote) => {
          console.log('Status updated to ACCEPTED:', updatedQuote);
          this.nextStep();
        },
        error: (err) => console.error('Error updating status to ACCEPTED:', err)
      });
    } else {
      this.nextStep();
    }
  }

  onSalesOrderLoaded(salesOrder: any): void {
    this.salesOrderStatus.set(salesOrder?.status || null);
    this.salesOrderId.set(salesOrder?.id || null);
  }
}
