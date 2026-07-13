import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quote } from '../../shared/models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/quotes`;

    getAll(): Observable<Quote[]> {
        return this.http.get<Quote[]>(this.baseUrl);
    }

    create(payload: { clientId: number }): Observable<Quote> {
        return this.http.post<Quote>(this.baseUrl, payload);
    }
}