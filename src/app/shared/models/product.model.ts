export type ProductCategory = 'LIVING_ROOM' | 'DINING_ROOM' | 'BEDROOM' | 'OFFICE' | 'OUTDOOR' | 'OTHER';

export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    category: ProductCategory;
    basePrice: number;
    laborCost?: number;
    profitMargin?: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    sku: string;
    name: string;
    description?: string;
    category?: ProductCategory;
    basePrice: number;
    laborCost?: number;
    profitMargin?: number;
    imageUrl?: string;
    isActive?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;