import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class MarketDataScopeApiService {
  private endpoint = 'MarketDataScope';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMDScope(countryCode?: string): Observable<MDScopeResponse> {
    return this.payfactorsApiService.get<MDScopeResponse>(`${this.endpoint}/GetMDScope`,
    { params: { countryCode: countryCode }});
  }
}
