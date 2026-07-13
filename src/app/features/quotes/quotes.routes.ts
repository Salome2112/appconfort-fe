import { Routes } from '@angular/router';
import { QuoteListComponent } from './pages/quote-list/quote-list.component';
import { QuoteFormComponent } from './pages/quote-form/quote-form.component';

export const QUOTE_ROUTES: Routes = [
    { path: '', component: QuoteListComponent },
    { path: 'new', component: QuoteFormComponent },
];