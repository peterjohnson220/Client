import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PricingMatchApiService {
  private endpoint = 'PricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getPricingMatchSummary(pricingMatchId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPricingMatchSummary?pricingMatchId=${pricingMatchId}`);
  }
}
