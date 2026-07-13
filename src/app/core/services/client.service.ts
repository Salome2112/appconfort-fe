import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, CreateClientDto, UpdateClientDto } from '../../shared/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/clients`;

    getAll(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl);
    }

    create(dto: CreateClientDto): Observable<Client> {
        return this.http.post<Client>(this.baseUrl, dto);
    }
    update(id: number, dto: UpdateClientDto): Observable<Client> {
        return this.http.put<Client>(`${this.baseUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}