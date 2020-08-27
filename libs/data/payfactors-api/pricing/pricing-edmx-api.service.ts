import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PricingEdmxApiService {
  private endpoint = 'CompanyJobPricing';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  deletePricing(deletePricingRequest: DeletePricingRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeletePricing`, { request: deletePricingRequest });
  }

  patchPricingStatus(pricingId: number, status: string): Observable<any> {
    return this.payfactorsApiService.patch(`${this.endpoint}(${pricingId})`, { Status: status });
  }
}
