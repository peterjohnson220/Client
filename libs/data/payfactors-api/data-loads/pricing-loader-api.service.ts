import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SavePricingLoaderConfigRequest } from 'libs/models/data-loads';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class PricingLoaderApiService {
  private endpoint = 'PricingLoader';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getWorksheetNames(request: File): Observable<string[]> {
    return this.payfactorsApiService.postFormData(`${this.endpoint}/GetWorksheetNames`, { file: request });
  }

  savePricingLoaderConfig(request: SavePricingLoaderConfigRequest): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/SavePricingLoaderConfiguration`, request);
  }
}
