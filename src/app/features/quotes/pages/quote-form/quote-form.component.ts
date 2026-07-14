import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerSearchModalComponent } from '../../components/customer-search-modal/customer-search-modal.component';
import { Client } from '../../../../shared/models/client.model';
import { Quote } from '../../../../shared/models/quote.model';
import { QuoteService } from '../../../../core/services/quote.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductPickerComponent } from '../../components/customer-search-modal/product-picker/product-picker.component';
import { QuoteItemsListComponent } from '../../components/quote-items-list/quote-items-list.component';

@Component({
    selector: 'app-quote-form',
    standalone: true,
    imports: [CustomerSearchModalComponent, CommonModule, FormsModule, ProductPickerComponent, QuoteItemsListComponent], // Empty imports for now since the header does not use any Angular directives
    templateUrl: './quote-form.component.html',

})
export class QuoteFormComponent {
    private router = inject(Router);
    private quoteService = inject(QuoteService);
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);

    // Guardaremos el ID que nos devuelva el backend
    quoteId = signal<number | null>(null);
    selectedClient = signal<Client | null>(null);
    isOpenClientSearch = signal<boolean>(false);
    isOpenProductSearch = signal<boolean>(false);
    products = signal<Product[]>([]);
    quote = signal<Quote | null>(null);
    isEditMode = signal(false);
    // Helper method to decide if we are editing or creating a new quote

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id'); // ← reads :id from URL
        if (id) {
            this.isEditMode.set(true);
            this.loadQuote(Number(id));
        }
    }
    loadQuote(id: number): void {
        this.quoteService.getById(id).subscribe({
            next: (quote) => {
                this.quote.set(quote);
                this.selectedClient.set(quote.client);
            },
            error: (err) => console.error('Error loading quote:', err)
        });
    }
    esEdicion(): boolean {
        return false;
    }

    openClientSearch() {
        this.isOpenClientSearch.set(true);
    }

    onClientSelected(client: Client): void {
        this.selectedClient.set(client);
        this.isOpenClientSearch.set(false);
        this.createQuote(client.id);
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getAll().subscribe({
            next: (data) => this.products.set(data.filter(p => p.isActive)),
        });
    }
    createQuote(clientId: number): void {
        this.quoteService.create({ clientId }).subscribe({
            next: (quote) => {
                this.quote.set(quote);         // ← saves full quote with id
                this.quoteId.set(quote.id);
            },
            error: (err) => console.error('Error creating quote:', err)
        });
    }

    // Este método se llamará cuando el usuario agregue un producto a la tabla
    onAgregarProducto(producto: any) {
        const idFactura = this.quoteId();

        if (!idFactura) return; // Seguridad: Si no hay ID, no hace nada

        const detalleProducto = {
            quote_id: idFactura, // Tu llave foránea requerida por la tabla pivote
            producto_id: producto.id,
            cantidad: 1,
            precio: producto.precio
        };

        console.log('Guardando en la tabla pivote producto_quotes...', detalleProducto);
        // this.quoteService.agregarProductoAlDetalle(detalleProducto).subscribe();
    }

    // 3. Cambiamos el método para que redirija en lugar de solo poner un console.log
    onRegresar(): void {
        // Cambia '/' por la ruta de tu pantalla principal (ej. '/cotizaciones')
        this.router.navigate(['/quotes']);
    }

}
