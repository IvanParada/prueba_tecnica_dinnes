import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CustomerLookup } from '../interfaces/customer-lookup.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerLookupService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/clientes/lookup`;

  lookupByEmail(
    email: string,
  ): Observable<CustomerLookup> {
    const params = new HttpParams().set(
      'email',
      email.trim(),
    );

    return this.http.get<CustomerLookup>(
      this.apiUrl,
      { params },
    );
  }
}