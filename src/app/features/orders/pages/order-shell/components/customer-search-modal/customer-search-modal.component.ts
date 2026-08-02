import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ClientService } from '../../../../../../core/services/client.service';
import { Client } from '../../../../../../shared/models/client.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { SharedModule } from 'primeng/api';

@Component({
    selector: 'app-customer-search-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, Dialog, InputText, Button, SharedModule],
    templateUrl: './customer-search-modal.component.html',
    styleUrl: './customer-search-modal.component.css'
})
export class CustomerSearchModalComponent implements OnInit {
    private clientService = inject(ClientService);
    customerSelected = output<any>();
    closeModal = output<void>();

    clients = signal<Client[]>([]);
    loading = signal(false);
    searchText = signal('');
    visible = signal(true);

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
        this.customerSelected.emit(customer);
    }

    onClose() {
        this.closeModal.emit();
    }
}
