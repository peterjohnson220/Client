import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeExplorerDataCutResponse, ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeDataFilterApiService {
  private endpoint = 'ExchangeDataFilter';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchangeScopeFilterContext(exchangeDataSearchRequest: BaseExchangeDataSearchRequest): Observable<ExchangeExplorerScopeResponse> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetExchangeScopeFilterContext`,
      exchangeDataSearchRequest
    );
  }

  getExchangeDataCutFilterContext(payload: {companyJobId: number, exchangeDataCutGuid: string}): Observable<ExchangeExplorerDataCutResponse> {
    return this.payfactorsApiService.get<ExchangeExplorerDataCutResponse>(
      `${this.endpoint}/GetExchangeDataCutFilterContext`,
      {params: payload}
      );
  }
}
