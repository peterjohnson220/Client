import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse, MDLocationsRequest } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class MarketDataScopeApiService {
  private endpoint = 'MarketDataScope';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMDScope(): Observable<MDScopeResponse> {
    return this.payfactorsApiService.get<MDScopeResponse>(`${this.endpoint}/GetMDScope`);
  }

  getMdLocations(request: MDLocationsRequest): Observable<string[]> {
    return this.payfactorsApiService.post<string[]>(`${this.endpoint}/GetLocations`, request);
  }
}
