import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';


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
}
