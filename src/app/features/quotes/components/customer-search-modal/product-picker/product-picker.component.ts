import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { QuoteService } from '../../../../../core/services/quote.service';


export interface Product {
    id: number;
    sku: string;
    name: string;
    basePrice: number;
}

@Component({
    selector: 'app-product-picker',
    imports: [CommonModule, FormsModule],
    templateUrl: './product-picker.component.html',
})
export class ProductPickerComponent implements OnInit {

    productAdded = output<void>();
    searchText = signal('');
    private productService = inject(ProductService);
    private quoteService = inject(QuoteService);
    products = signal<Product[]>([]);
    quoteId = input.required<number>();

    ngOnInit(): void {
        this.productService.getAll().subscribe({
            next: (data) => this.products.set(data.filter(p => p.isActive))
        });
    }

    filteredProducts = computed(() => {
        const search = this.searchText().toLowerCase();
        if (!search) return this.products();
        return this.products().filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search)
        );
    });

    addProduct(product: Product): void {
        this.quoteService.addItem(this.quoteId(), {
            productId: product.id,
            quantity: 1,
            unitPrice: product.basePrice
        }).subscribe({
            next: () => {
                this.productAdded.emit(); // ← notify parent
                //this.loadItems();         // ← reload items list
            },
            error: (err) => console.error('Error adding item:', err)
        });
    }
}