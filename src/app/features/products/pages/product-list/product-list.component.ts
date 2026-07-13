import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../shared/models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductFormComponent],
    templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);

    products = signal<Product[]>([]);
    loading = signal(false);
    error = signal('');
    mostrarModal = signal(false);
    productoSeleccionado = signal<Product | null>(null);

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.productService.getAll().subscribe({
            next: (data) => {
                this.products.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar productos');
                this.loading.set(false);
            }
        });
    }

    abrirModal(): void {
        this.productoSeleccionado.set(null);
        this.mostrarModal.set(true);
    }

    seleccionarProducto(producto: Product): void {
        this.productoSeleccionado.set(producto);
        this.mostrarModal.set(true);
    }

    cerrarModal(): void {
        this.mostrarModal.set(false);
        this.productoSeleccionado.set(null);
    }

    alGuardar(): void {
        this.mostrarModal.set(false);
        this.productoSeleccionado.set(null);
        this.loadProducts();
    }
}