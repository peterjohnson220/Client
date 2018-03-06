import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeMapFilter, ExchangeMapResponse, InitialMapFilterRequest } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';
import { FilterAggregateGroup } from '../../../models/peer/aggregate-filters';


@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getInitialMapFilter(initialMapFilterRequest: InitialMapFilterRequest): Observable<ExchangeMapFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetInitialMapFilter`, {
      params: {
        CompanyJobId: initialMapFilterRequest.CompanyJobId,
        CompanyPayMarketId: initialMapFilterRequest.CompanyPayMarketId
      }
    });
  }

  getMapData(exchangeMapFilter: ExchangeMapFilter): Observable<ExchangeMapResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeMapFilter);
  }

  getMapFilters(exchangeMapFilter: ExchangeMapFilter): Observable<FilterAggregateGroup[]> {
   return this.payfactorsApiService.post(`${this.endpoint}/GetMapFilters`, exchangeMapFilter);
  }
}
