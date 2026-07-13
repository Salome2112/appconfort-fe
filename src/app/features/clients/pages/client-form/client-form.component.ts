import { Component, Output, EventEmitter, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../shared/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent {
  private clientService = inject(ClientService);
  @Input() cliente: Client | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  esEdicion = signal(false);

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