import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UpsertExchangeScopeRequest } from '../../../models/peer/requests/upsert-exchange-scope-request.model';

@Injectable()
export class ExchangeScopeApiService {
  private endpoint = 'ExchangeScope';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertExchangeScope(request: UpsertExchangeScopeRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchangeScope`, request);
  }

  validateExchangeScopeName(exchangeId: number, exchangeScopeName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidExchangeScopeName`,
      { params: { exchangeId: exchangeId, exchangeScopeName: exchangeScopeName } }
    );
  }
}
