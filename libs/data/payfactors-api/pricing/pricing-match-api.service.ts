import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { Observable } from 'rxjs';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';
import { PricingMatchEntityTypes } from 'libs/constants';


@Injectable({
  providedIn: 'root',
})
export class PricingMatchApiService {
  private endpoint = 'PricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getPricingMatchSummary(entityId: any, entityType: PricingMatchEntityTypes): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPricingMatchSummary?entityId=${entityId}&entityType=${entityType}`);
  }

  getPricingMatchSummaryForCustomScope(customScope: BaseExchangeDataSearchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetPricingMatchSummary`, customScope);
  }
}
