import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ExchangeScopeItem, ExchangeScopes, UpsertExchangeExplorerScopeRequest } from 'libs/models/peer';
import { ExchangeScopesByExchangeRequest } from 'libs/models/payfactors-api/peer/exchange-scopes/request';
import { ExchangeScopesByJobsRequest } from 'libs/models/payfactors-api/peer/exchange-scopes/request/exchange-scopes-by-jobs-request';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeScopeApiService {
  private endpoint = 'ExchangeScope';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertExchangeExplorerScope(request: UpsertExchangeExplorerScopeRequest): Observable<ExchangeScopeItem> {
    return this.payfactorsApiService.post<ExchangeScopeItem>(`${this.endpoint}/UpsertExchangeExplorerScope`, request);
  }

  validateExchangeScopeName(exchangeId: number, exchangeScopeName: string, isStandardScope: boolean): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidExchangeScopeName`,
      { params: { exchangeId: exchangeId, exchangeScopeName: exchangeScopeName, isStandardScope: isStandardScope } }
    );
  }

  getExchangeScopesByJobs(request: ExchangeScopesByJobsRequest): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.post<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByJobs`,
      request
    );
  }

  getExchangeScopesByExchange(request: ExchangeScopesByExchangeRequest): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.post<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByExchange`,
      request
    );
  }

  getCompanyExchangeScopes(): Observable<any> {
    return this.payfactorsApiService.get<ExchangeScopes[]>(`${this.endpoint}/GetCompanyExchangeScopes`);
  }

  deleteExchangeScope(exchangeScopeId: number, isStandardScope: boolean): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}/DeleteExchangeScope`,
      { ExchangeScopeId: exchangeScopeId, IsStandardScope: isStandardScope }
  );
  }

}
