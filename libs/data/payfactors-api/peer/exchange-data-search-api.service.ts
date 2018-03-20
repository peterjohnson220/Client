import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import {
  ExchangeDataSearchFilter, ExchangeMapResponse, ExchangeJobPayMarketFilterRequest, ExchangeJobPayMarketFilter,
  FilterAggregateGroup } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchangeJobAndPayMarketFilter(request: ExchangeJobPayMarketFilterRequest): Observable<ExchangeJobPayMarketFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetExchangeJobAndPayMarketFilter`, {
      params: {
        CompanyJobId: request.CompanyJobId,
        CompanyPayMarketId: request.CompanyPayMarketId
      }
    });
  }

  getMapData(exchangeDataSearchFilter: ExchangeDataSearchFilter): Observable<ExchangeMapResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeDataSearchFilter);
  }

  getFilterAggregates(exchangeDataSearchFilter: ExchangeDataSearchFilter): Observable<FilterAggregateGroup[]> {
   return this.payfactorsApiService.post(`${this.endpoint}/GetFilterAggregates`, exchangeDataSearchFilter);
  }
}
