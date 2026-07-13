import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../shared/models/client.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-customer-search-modal',
    standalone: true,
    imports: [CommonModule, FormsModule], // Aquí importarás CommonModule o FormsModule si usas inputs de texto
    templateUrl: './customer-search-modal.component.html',
})
export class CustomerSearchModalComponent implements OnInit {
    private clientService = inject(ClientService);
    // Un "output" es la forma moderna en Angular de enviar datos desde un componente hijo a un padre
    customerSelected = output<any>();
    closeModal = output<void>();

    clients = signal<Client[]>([]);
    loading = signal(false);
    searchText = signal('');

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients(): void {
        this.loading.set(true);
        this.clientService.getAll().subscribe({
            next: (data) => {
                this.clients.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    filteredClients = computed(() => {
        const search = this.searchText().toLowerCase();
        if (!search) return this.clients();
        return this.clients().filter(c =>
            c.firstName.toLowerCase().includes(search) ||
            c.lastName.toLowerCase().includes(search) ||
            c.nui.toLowerCase().includes(search)
        );
    });

    selectCustomer(customer: any) {
        // Notificamos al componente padre (quote-form) qué cliente se eligió
        this.customerSelected.emit(customer);
    }

    onClose() {
        this.closeModal.emit();
    }
}