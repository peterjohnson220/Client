import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ECommerceSettings } from 'libs/models/payfactors-api/ecommerce';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ECommerceApiService {
  private readonly endpoint = 'ECommerce';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getSettings(): Observable<ECommerceSettings> {
    return this.payfactorsApiService.get<ECommerceSettings>(`${this.endpoint}/GetSettings`);
  }
}
