export type ProductCategory = 'LIVING_ROOM' | 'DINING_ROOM' | 'BEDROOM' | 'OFFICE' | 'OUTDOOR' | 'OTHER';

export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    category: ProductCategory;
    imageUrl?: string;
    isActive: boolean;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    profitMargin: number;
    taxRate: number;
    basePrice: number;
    finalPrice: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    sku: string;
    name: string;
    description?: string;
    category?: ProductCategory;
    imageUrl?: string;
    isActive?: boolean;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    profitMargin: number;
    taxRate: number;
    basePrice: number;
    finalPrice: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;