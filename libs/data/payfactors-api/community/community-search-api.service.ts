import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunitySearchResult } from 'libs/models/community';

@Injectable()
export class CommunitySearchApiService {
  private endpoint = 'CommunitySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  searchCommunity(searchTerm: any, searchDuration: any, from = 0, count = 15): Observable<CommunitySearchResult[]> {
    return this.payfactorsApiService.post<CommunitySearchResult[]>
    (`${this.endpoint}/Get`,  { SearchTerm: searchTerm,  SearchDuration: searchDuration, PagingOptions: {From: from, Count: count}  });
  }
}
