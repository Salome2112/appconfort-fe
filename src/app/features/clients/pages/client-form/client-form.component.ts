import { Component, Output, EventEmitter, inject, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../shared/models/client.model';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, InputText, Button, SharedModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css' // stylesheet reference
})
export class ClientFormComponent implements OnInit {
  private clientService = inject(ClientService);
  @Input() cliente: Client | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  esEdicion = signal(false);
  visible = signal(true);

  formData = {
    nui: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  ngOnInit(): void {
    if (this.cliente) {
      this.esEdicion.set(true);
      this.formData = {
        nui: this.cliente.nui,
        firstName: this.cliente.firstName,
        lastName: this.cliente.lastName,
        email: this.cliente.email ?? '',
      };
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGuardar(): void {
    if (this.esEdicion() && this.cliente) {
      this.clientService.update(this.cliente.id, this.formData).subscribe({
        next: () => this.guardado.emit(),
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.clientService.create(this.formData).subscribe({
        next: () => this.guardado.emit(),
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  onEliminar(): void {
    if (this.cliente) {
      this.clientService.delete(this.cliente.id).subscribe({
        next: () => this.guardado.emit(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}