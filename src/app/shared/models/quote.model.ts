import { Client } from './client.model';
import { Product } from './product.model';

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface QuoteItem {
    id: number;
    quoteId: number;
    productId: number;
    quantity: number;
    unitPrice: string;
    discountPercent: string;
    subtotal: string;
    customDetails?: string;
    sortOrder: number;
    product: Product;
}

export interface Quote {
    id: number;
    number: string;
    clientId: number;
    status: QuoteStatus;
    discountPercent: string;
    subtotal: string;
    discountAmount: string;
    taxAmount: string;
    total: string;
    deliveryDays?: number;
    validityDays: number;
    notes?: string;
    internalNotes?: string;
    issuedAt: string;
    expiresAt?: string;
    acceptedAt?: string;
    createdAt: string;
    updatedAt: string;
    client: Client;
    items: QuoteItem[];
    salesOrder?: any;
}