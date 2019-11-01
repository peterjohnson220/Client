import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ExchangeDataSearchFilter, ExchangeMapResponse, SystemFilterRequest, SystemFilter,
  FilterAggregateGroup, ExchangeExplorerContextInfo
} from 'libs/models/peer';
import { SearchFilter } from 'libs/models/payfactors-api/search/response';
import {
  ExchangeDataSearchRequest,
  SearchExchangeAggregationsRequest,
  ExchangeDataSearchResponse
} from 'libs/models/payfactors-api/peer/exchange-data-search';

import { PayfactorsApiService } from '../../payfactors-api.service';

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

  getExchangeExplorerContextInfo(payload: {companyJobId?: number, companyPayMarketId?: number}|{exchangeId: number}):
    Observable<ExchangeExplorerContextInfo> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetExchangeExplorerContextInfo`, {
      params: payload
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

  getAssociatedExchangeJobs(companyJobId: number): Observable<string[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetAssociatedExchangeJobs`, {
      params: {
        companyJobId: companyJobId
      }
    });
  }

  searchExchangeData(searchRequest: ExchangeDataSearchRequest): Observable<ExchangeDataSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetResults`, searchRequest);
  }

  searchExchangeAggregations(request: SearchExchangeAggregationsRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchAggregations`, request);
  }

}
