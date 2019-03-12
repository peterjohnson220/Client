import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ExchangeDataSearchFilter, ExchangeMapResponse, SystemFilterRequest, SystemFilter,
  FilterAggregateGroup } from 'libs/models/peer';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getSystemFilter(request: SystemFilterRequest): Observable<SystemFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSystemFilter`, {
      params: {
        CompanyJobId: request.CompanyJobId,
        CompanyPayMarketId: request.CompanyPayMarketId
      }
    });
  }

  getMapData(exchangeDataSearchFilter: ExchangeDataSearchFilter): Observable<ExchangeMapResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeDataSearchFilter);
  }

  getMapBounds(exchangeDataSearchFilter: ExchangeDataSearchFilter): Observable<ExchangeMapResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapBounds`, exchangeDataSearchFilter);
  }

  getMapHasData(exchangeId: number): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/HasMapData`,  exchangeId);
  }

  getFilterAggregates(exchangeDataSearchFilter: ExchangeDataSearchFilter): Observable<FilterAggregateGroup[]> {
   return this.payfactorsApiService.post(`${this.endpoint}/GetFilterAggregates`, exchangeDataSearchFilter);
  }
}
