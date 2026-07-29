import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ServiceRequestsQuery,
  ServiceRequestsResponse,
} from '../interfaces/service-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceRequestsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/solicitudes`;

  getAll(
    query: ServiceRequestsQuery = {},
  ): Observable<ServiceRequestsResponse> {
    let params = new HttpParams();

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    if (query.sortOrder) {
      params = params.set('sortOrder', query.sortOrder);
    }

    if (query.page !== undefined) {
      params = params.set('page', query.page);
    }

    if (query.limit !== undefined) {
      params = params.set('limit', query.limit);
    }

    return this.http.get<ServiceRequestsResponse>(
      this.apiUrl,
      { params },
    );
  }
}