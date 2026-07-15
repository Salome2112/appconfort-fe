import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductDto, UpdateProductDto } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/products`;

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl);
    }

    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(dto: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, dto);
    }

    update(id: number, dto: UpdateProductDto): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(
            `${this.baseUrl}/upload-image`,
            formData
        );
    }
}