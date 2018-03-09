import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeDataCutFilter, ExchangeMapResponse, BaseFilterRequest, ExchangeDataCutBaseFilter } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';
import { FilterAggregateGroup } from '../../../models/peer/aggregate-filters';

@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getBaseFilter(baseFilterRequest: BaseFilterRequest): Observable<ExchangeDataCutBaseFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBaseFilter`, {
      params: {
        CompanyJobId: baseFilterRequest.CompanyJobId,
        CompanyPayMarketId: baseFilterRequest.CompanyPayMarketId
      }
    });
  }

  getMapData(exchangeDataCutFilter: ExchangeDataCutFilter): Observable<ExchangeMapResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeDataCutFilter);
  }

  getFilterAggregates(exchangeDataCutFilter: ExchangeDataCutFilter): Observable<FilterAggregateGroup[]> {
   return this.payfactorsApiService.post(`${this.endpoint}/GetFilterAggregates`, exchangeDataCutFilter);
  }
}
