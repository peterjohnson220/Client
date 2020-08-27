import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunitySearchResult } from 'libs/models/community';
import { CommunitySearchQuery } from 'libs/models/community/community-search-query.model';

@Injectable({
  providedIn: 'root',
})
export class CommunitySearchApiService {
  private endpoint = 'CommunitySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  searchCommunity(payload: CommunitySearchQuery, from = 0, count = 15): Observable<CommunitySearchResult[]> {
    return this.payfactorsApiService.post<CommunitySearchResult[]>
    (`${this.endpoint}/Get`,
      {
        SearchTerm: payload.searchTerm,
        SearchSort: payload.searchSort,
        SearchDuration: payload.searchDuration,
        PagingOptions: {From: from, Count: count}
      });
  }
}
