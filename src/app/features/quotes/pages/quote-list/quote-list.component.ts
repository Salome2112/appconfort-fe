import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../../../core/services/quote.service';
import { Quote } from '../../../../shared/models/quote.model';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-quote-list',
    standalone: true,
    imports: [CommonModule, TableModule, Button, Tag],
    templateUrl: './quote-list.component.html',
    styleUrl: './quote-list.component.css'
})
export class QuoteListComponent implements OnInit {
    private quoteService = inject(QuoteService);
    private router = inject(Router);

    quotes = signal<Quote[]>([]);
    loading = signal(false);
    error = signal('');

    ngOnInit(): void {
        this.loadQuotes();
    }

    goToQuote(id: number): void {
        this.router.navigate(['/quotes', id]);
    }

    loadQuotes(): void {
        this.loading.set(true);
        this.quoteService.getAll().subscribe({
            next: (data) => {
                this.quotes.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar proformas');
                this.loading.set(false);
            }
        });
    }

    goToNewQuote(): void {
        this.router.navigate(['/quotes/new']);
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            'DRAFT': 'Borrador',
            'SENT': 'Enviada',
            'ACCEPTED': 'Aceptada',
            'REJECTED': 'Rechazada',
            'CANCELLED': 'Cancelada',
        };
        return labels[status] ?? status;
    }

    getStatusSeverity(status: string): 'secondary' | 'info' | 'success' | 'danger' | 'warn' {
        const severities: Record<string, 'secondary' | 'info' | 'success' | 'danger' | 'warn'> = {
            'DRAFT': 'secondary',
            'SENT': 'info',
            'ACCEPTED': 'success',
            'REJECTED': 'danger',
            'CANCELLED': 'warn',
        };
        return severities[status] ?? 'secondary';
    }


}