import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MDScopeResponse, MDLocationsRequest, MDLocationResponse } from 'libs/models/payfactors-api';
import { GroupedListItem } from 'libs/models';
import { TreeViewItem } from 'libs/ui/common/multi-select-treeview/models';

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

  getCompanyScopeSizes(): Observable<GroupedListItem[]> {
    return this.payfactorsApiService.get<GroupedListItem[]>(`${this.endpoint}/GetCompanyScopeSizes`);
  }

  getDistinctIndustries(): Observable<TreeViewItem[]> {
    return this.payfactorsApiService.get<TreeViewItem[]>(`${this.endpoint}/GetDistinctIndustries`);
  }
}
