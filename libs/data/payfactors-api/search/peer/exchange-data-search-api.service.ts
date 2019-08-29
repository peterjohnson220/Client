import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ExchangeDataSearchFilter, ExchangeMapResponse, SystemFilterRequest, SystemFilter,
  FilterAggregateGroup } from 'libs/models/peer';

import { PayfactorsApiService } from '../../payfactors-api.service';
import {SearchSurveyAggregationsRequest, SurveySearchRequest} from '../../../../models/payfactors-api/survey-search/request';
import {SearchFilter} from '../../../../models/payfactors-api/search/response';
import {
  ExchangeDataSearchRequest,
  SearchExchangeAggregationsRequest
} from '../../../../models/payfactors-api/peer-exchange-explorer-search/request';
import {ExchangeDataSearchResponse} from '../../../../models/payfactors-api/peer-exchange-explorer-search/response';

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
