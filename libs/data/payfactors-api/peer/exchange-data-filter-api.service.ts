import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeExplorerDataCutResponse, ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter';
import { TempDataCutIdentity } from 'libs/features/temp-data-cut/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeDataFilterApiService {
  private endpoint = 'ExchangeDataFilter';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchangeScopeFilterContext(exchangeDataSearchRequest: BaseExchangeDataSearchRequest, isStandardScope: boolean): Observable<ExchangeExplorerScopeResponse> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetExchangeScopeFilterContext`,
      { exchangeDataSearchRequest: exchangeDataSearchRequest, isStandardScope: isStandardScope }
    );
  }

  getExchangeDataCutFilterContext(payload: {companyJobId: number, exchangeDataCutGuid: string}): Observable<ExchangeExplorerDataCutResponse> {
    return this.payfactorsApiService.get<ExchangeExplorerDataCutResponse>(
      `${this.endpoint}/GetExchangeDataCutFilterContext`,
      {params: payload}
      );
  }

  getTempExchangeDataCutFilterContext(payload: {lockedExchangeJobId: number, exchangeDataSearchRequest: BaseExchangeDataSearchRequest}): Observable<ExchangeExplorerDataCutResponse> {
    return this.payfactorsApiService.post<ExchangeExplorerDataCutResponse>(`${this.endpoint}/GetTempExchangeDataCutFilterContext`, {
      LockedExchangeJobId: payload.lockedExchangeJobId,
      ExchangeDataSearchRequest: payload.exchangeDataSearchRequest
    });
  }

  getTempExchangeDataCutFilterContextFromEntity(payload: TempDataCutIdentity): Observable<ExchangeExplorerDataCutResponse> {
    return this.payfactorsApiService.post<ExchangeExplorerDataCutResponse>(`${this.endpoint}/GetTempExchangeDataCutFilterContextFromEntity`, payload);
  }
}
