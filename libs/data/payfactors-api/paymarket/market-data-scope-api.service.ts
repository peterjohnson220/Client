import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse, MDLocationsRequest, MDLocationResponse } from 'libs/models/payfactors-api';

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

  getMdLocations(request: MDLocationsRequest): Observable<MDLocationResponse[]> {
    return this.payfactorsApiService.post<MDLocationResponse[]>(`${this.endpoint}/GetLocations`, request);
  }
}
