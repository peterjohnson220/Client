import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ExchangeScopeItem, ExchangeScopes, UpsertExchangeExplorerScopeRequest } from 'libs/models/peer';

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

  getExchangeScopesByJobs(exchangeJobIds: number[]): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.get<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByJobs`,
      { params: { exchangeJobIds: exchangeJobIds } }
    );
  }

  getExchangeScopesByExchange(exchangeId: number, includeCompanyScopes: boolean, includeStandardScopes: boolean): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.get<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByExchange`,
      { params: { exchangeId: exchangeId, includeCompanyScopes: includeCompanyScopes, includeStandardScopes: includeStandardScopes } }
    );
  }

  getCompanyExchangeScopes(): Observable<any> {
    return this.payfactorsApiService.get<ExchangeScopes[]>(`${this.endpoint}/GetCompanyExchangeScopes`);
  }

  deleteExchangeScope(exchangeScopeId: number): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}/DeleteExchangeScope`,
      { ExchangeScopeId: exchangeScopeId }
    );
  }

}
