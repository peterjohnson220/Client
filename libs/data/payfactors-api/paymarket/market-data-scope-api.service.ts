import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse, MDScopeRequest } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class MarketDataScopeApiService {
  private endpoint = 'MarketDataScope';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMDScope(request: MDScopeRequest): Observable<MDScopeResponse> {
    return this.payfactorsApiService.post<MDScopeResponse>(`${this.endpoint}/GetMDScope`, request);
  }
}
