import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Observable } from 'rxjs';
import { PricingNote } from 'libs/models/payfactors-api';


@Injectable()
export class PricingApiService {
  private endpoint = 'CompanyJobPricing';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  deletePricing(deletePricingRequest: DeletePricingRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeletePricing`, { request: deletePricingRequest });
  }

  deletePricingMatch(pricingMatchId: number): Observable<any> {
    return this.payfactorsApiService.delete(`${this.endpoint}/DeletePricingMatch?pricingMatchId=${pricingMatchId}`);
  }

  patchPricingStatus(pricingId: number, status: string): Observable<any> {
    return this.payfactorsApiService.patch(`${this.endpoint}(${pricingId})`, { Status: status });
  }

  getNotes(pricingId: number): Observable<PricingNote[]> {
    return this.payfactorsApiService.get<PricingNote[]>(`${this.endpoint}/GetNotes?pricingID=${pricingId}`);
  }
}
