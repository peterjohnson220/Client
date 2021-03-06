import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ExchangeExplorerContextInfo, PayMarketContext } from 'libs/models/peer';
import { SearchFilter } from 'libs/models/payfactors-api/search/response';
import {
  ExchangeDataSearchRequest,
  SearchExchangeAggregationsRequest,
  ExchangeDataSearchResponse,
  HistoricalExchangeDataSearchRequest,
  HistoricalExchangeDataSearchResponse,
  HistoricalExchangeOrgIncCountResponse
} from 'libs/models/payfactors-api/peer/exchange-data-search';
import { ComphubExchangeExplorerContextRequest } from 'libs/models/peer/requests/comphub-exchange-explorer-context-request.model';

import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchangeExplorerContextInfo(
    payload: ComphubExchangeExplorerContextRequest |
    { companyJobId?: number, companyPayMarketId?: number } |
    { exchangeId: number }
    ):
    Observable<ExchangeExplorerContextInfo> {
    const request: ComphubExchangeExplorerContextRequest = payload as ComphubExchangeExplorerContextRequest;
    if (request && request.ExchangeJobIds) {
      return this.payfactorsApiService.post(`${this.endpoint}/GetExchangeExplorerContextInfo`, request);
    }

    return this.payfactorsApiService.get(`${this.endpoint}/GetExchangeExplorerContextInfo`, {
      params: payload
    });
  }

  getLockedExchangeExplorerContextInfo(payload: { lockedExchangeJobId: number, companyPayMarketId?: number }): Observable<ExchangeExplorerContextInfo> {
    const lockedExchangeJobPayload = {
      lockedExchangeJobId: payload.lockedExchangeJobId,
      companyPayMarketId: !!payload.companyPayMarketId ? payload.companyPayMarketId : 0
    };
    return this.payfactorsApiService.get(`${this.endpoint}/GetExchangeExplorerContextInfoForLockedExchangeJob`, {
      params: lockedExchangeJobPayload
    });
  }

  getPayMarketContextInfo(payload: {companyJobId?: number, companyPayMarketId?: number, exchangeJobId?: number}|
                                   {companyJobId?: number, exchangeJobId?: number, cutGuid?: string}):
    Observable<PayMarketContext> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPayMarketContextInfo`, {
      params: payload
    });
  }

  getMapHasData(exchangeId: number): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/HasMapData`,  exchangeId);
  }

  searchExchangeData(searchRequest: ExchangeDataSearchRequest): Observable<ExchangeDataSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetResults`, searchRequest);
  }

  searchExchangeAggregations(request: SearchExchangeAggregationsRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchAggregations`, request);
  }

  getHistoricalTrends(request: HistoricalExchangeDataSearchRequest): Observable<HistoricalExchangeDataSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetHistoricalTrend`, request);
  }

  getOrgIncCountHistory(request: HistoricalExchangeDataSearchRequest): Observable<HistoricalExchangeOrgIncCountResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetHistoricalOrgIncCount`, request);
  }
}
