import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../../../core/services/quote.service';
import { Quote } from '../../../../shared/models/quote.model';

@Component({
    selector: 'app-quote-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quote-list.component.html',
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

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'DRAFT': 'bg-gray-100 text-gray-600',
            'SENT': 'bg-blue-100 text-blue-600',
            'ACCEPTED': 'bg-green-100 text-green-600',
            'REJECTED': 'bg-red-100 text-red-600',
            'CANCELLED': 'bg-yellow-100 text-yellow-600',
        };
        return classes[status] ?? 'bg-gray-100 text-gray-600';
    }


}