import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  UpsertExchangeScopeRequest, PeerMapScopeDetails, PeerMapScopeSystemDetails,
  ExchangeScopeItem, ExchangeDataSearchFilter, ExchangeScopes, UpsertExchangeExplorerScopeRequest
} from 'libs/models/peer';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeScopeApiService {
  private endpoint = 'ExchangeScope';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertExchangeScope(request: UpsertExchangeScopeRequest): Observable<ExchangeScopeItem> {
    return this.payfactorsApiService.post<ExchangeScopeItem>(`${this.endpoint}/UpsertExchangeScope`, request);
  }

  upsertExchangeExplorerScope(request: UpsertExchangeExplorerScopeRequest): Observable<ExchangeScopeItem> {
    return this.payfactorsApiService.post<ExchangeScopeItem>(`${this.endpoint}/UpsertExchangeExplorerScope`, request);
  }

  validateExchangeScopeName(exchangeId: number, exchangeScopeName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidExchangeScopeName`,
      { params: { exchangeId: exchangeId, exchangeScopeName: exchangeScopeName } }
    );
  }

  getExchangeScopesByJobs(exchangeJobIds: number[]): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.get<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByJobs`,
      { params: { exchangeJobIds: exchangeJobIds } }
    );
  }

  getExchangeScopesByExchange(exchangeId: number): Observable<ExchangeScopeItem[]> {
    return this.payfactorsApiService.get<ExchangeScopeItem[]>(`${this.endpoint}/GetExchangeScopeListByExchange`,
      { params: { exchangeId: exchangeId } }
    );
  }

  getDataCutPeerMapScope(dataCutGuid: string): Observable<PeerMapScopeSystemDetails> {
    return this.payfactorsApiService.get<PeerMapScopeSystemDetails>(`${this.endpoint}/GetDataCutPeerMapScope`,
      { params: { dataCutGuid: dataCutGuid } }
    );
  }

  getPeerMapScope(exchangeScopeGuid: string, filterModel: ExchangeDataSearchFilter): Observable<PeerMapScopeDetails> {
    return this.payfactorsApiService.post<PeerMapScopeDetails>(`${this.endpoint}/GetPeerMapScope`,
      { ExchangeScopeGuid: exchangeScopeGuid, FilterModel: filterModel }
    );
  }

  getCompanyExchangeScopes(): Observable<any> {
    return this.payfactorsApiService.get<ExchangeScopes[]>(`${this.endpoint}/GetCompanyExchangeScopes`);
  }

  deleteExchangeScope(exchangeScopeGuid: string): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}/DeleteExchangeScope`,
      { ExchangeScopeGuid: exchangeScopeGuid }
    );
  }

}
