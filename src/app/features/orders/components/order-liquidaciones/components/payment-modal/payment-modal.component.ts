import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SharedModule } from 'primeng/api';
import { PaymentService, CreatePaymentDto } from '../../../../../../core/services/payment.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, InputText, Button, SharedModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css'
})
export class PaymentModalComponent {
  private paymentService = inject(PaymentService);

  salesOrderId = input.required<number>();
  visible = input<boolean>(false);
  closeModal = output<void>();
  paymentSaved = output<void>();

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Form fields
  paymentMethod = signal<'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK'>('CASH');
  amount = signal<number | null>(null);
  notes = signal<string>('');

  onClose() {
    this.closeModal.emit();
  }

  savePayment() {
    const amt = this.amount();
    if (!amt || amt <= 0) {
      this.error.set('Por favor ingrese un monto válido mayor a 0.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const dto: CreatePaymentDto = {
      salesOrderId: this.salesOrderId(),
      paymentMethod: this.paymentMethod(),
      amount: amt,
      notes: this.notes() || undefined
    };

    this.paymentService.create(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.paymentSaved.emit();
        this.onClose();
        // Reset form
        this.amount.set(null);
        this.notes.set('');
        this.paymentMethod.set('CASH');
      },
      error: (err) => {
        console.error('Error creating payment:', err);
        const errMsg = err.error?.message || 'Error al registrar el pago. Inténtelo de nuevo.';
        this.error.set(errMsg);
        this.loading.set(false);
      }
    });
  }
}
