import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Observable } from 'rxjs';
import { PricingNote } from 'libs/models/payfactors-api';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';


@Injectable()
export class PricingApiService {
  private endpoint = 'CompanyJobPricing';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  deletePricing(deletePricingRequest: DeletePricingRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeletePricing`, { request: deletePricingRequest });
  }

  patchPricingStatus(pricingId: number, status: string) {
    return this.payfactorsApiService.patch(`${this.endpoint}(${pricingId})`, { Status: status });
  }

  getNotes(pricingId: number): Observable<PricingNote[]> {
    return this.payfactorsApiService.get<PricingNote[]>(`${this.endpoint}/GetNotes?pricingID=${pricingId}`);
  }
}
