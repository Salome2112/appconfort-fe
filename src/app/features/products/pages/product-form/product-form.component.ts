import { Component, Output, EventEmitter, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Product, CreateProductDto, ProductCategory } from '../../../../shared/models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
    private productService = inject(ProductService);

    @Input() producto: Product | null = null;
    @Output() cerrar = new EventEmitter<void>();
    @Output() guardado = new EventEmitter<void>();

    imagePreview = signal<string | null>(null);
    isUploadingImage = signal(false);
    esEdicion = signal(false);

    categorias: ProductCategory[] = [
        'LIVING_ROOM', 'DINING_ROOM', 'BEDROOM', 'OFFICE', 'OUTDOOR', 'OTHER'
    ];

    formData: CreateProductDto = {
        sku: '',
        name: '',
        description: '',
        category: 'OTHER',
        basePrice: 0,
        isActive: true,
    };

    ngOnInit(): void {
        if (this.producto) {
            this.esEdicion.set(true);
            this.formData = {
                sku: this.producto.sku,
                name: this.producto.name,
                description: this.producto.description ?? '',
                category: this.producto.category,
                basePrice: this.producto.basePrice,
                laborCost: this.producto.laborCost,
                profitMargin: this.producto.profitMargin,
                isActive: this.producto.isActive,
                imageUrl: `${environment.apiUrl}${this.producto.imageUrl}`
            };
        }
    }

    onCerrar(): void {
        this.cerrar.emit();
    }

    onGuardar(): void {
        if (this.esEdicion() && this.producto) {
            this.productService.update(this.producto.id, this.formData).subscribe({
                next: () => this.guardado.emit(),
                error: (err) => console.error('Error al actualizar:', err)
            });
        } else {
            this.productService.create(this.formData).subscribe({
                next: () => this.guardado.emit(),
                error: (err) => console.error('Error al crear:', err)
            });
        }
    }

    onEliminar(): void {
        if (this.producto) {
            this.productService.delete(this.producto.id).subscribe({
                next: () => this.guardado.emit(),
                error: (err) => console.error('Error al eliminar:', err)
            });
        }
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview.set(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to backend
        this.isUploadingImage.set(true);
        this.productService.uploadImage(file).subscribe({
            next: (res) => {
                this.formData.imageUrl = res.imageUrl;
                this.isUploadingImage.set(false);
            },
            error: (err) => {
                console.error('Error uploading image:', err);
                this.isUploadingImage.set(false);
            }
        });
    }
}