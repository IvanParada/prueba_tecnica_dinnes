import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DashboardStats } from '../interfaces/dashboard.interface';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/dashboard`;

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(this.apiUrl);
    }
}