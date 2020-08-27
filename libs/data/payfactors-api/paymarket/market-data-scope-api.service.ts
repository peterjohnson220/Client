import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse, MDLocationsRequest, MDLocationResponse } from 'libs/models/payfactors-api';
import { GroupedListItem } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
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

  getCompanyScopeSizes(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetCompanyScopeSizes`);
  }

  getDistinctIndustries(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetDistinctIndustries`);
  }

  getAllIndustries(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetAllIndustries`);
  }

  getCompanyScopeGeo(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetCompanyScopeGeo`);
  }

  getAllScopeSizes(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetAllScopeSizes`);
  }

  getGroupedListLocations(request: MDLocationsRequest): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.post<GroupedListItem[]>(`${this.endpoint}/GetGroupedListLocations`, request);
  }
}
