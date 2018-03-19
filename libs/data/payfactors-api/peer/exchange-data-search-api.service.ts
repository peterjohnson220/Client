import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import {
  ExchangeDataSearchFilter, ExchangeMapResponse, BaseFilterRequest, ExchangeDataSearchBaseFilter,
  FilterAggregateGroup } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getBaseFilter(baseFilterRequest: BaseFilterRequest): Observable<ExchangeDataSearchBaseFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBaseFilter`, {
      params: {
        CompanyJobId: baseFilterRequest.CompanyJobId,
        CompanyPayMarketId: baseFilterRequest.CompanyPayMarketId
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
