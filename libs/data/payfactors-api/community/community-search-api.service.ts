import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunitySearchResult } from 'libs/models/community';

@Injectable()
export class CommunitySearchApiService {
  private endpoint = 'CommunitySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  searchCommunity(search: string): Observable<CommunitySearchResult[]> {
    return this.payfactorsApiService.post<CommunitySearchResult[]>
    (`${this.endpoint}/Get`,  { SearchTerm: search,  PagingOptions: {From: 0, Count: 15}  });
  }
}
