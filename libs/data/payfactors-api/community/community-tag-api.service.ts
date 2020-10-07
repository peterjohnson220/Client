import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityTag } from 'libs/models/community';

@Injectable({
  providedIn: 'root',
})
export class CommunityTagApiService {
  private endpoint = 'CommunityTags';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getPopularTags(): Observable<any> {
    return this.payfactorsApiService.get<CommunityTag[]>
    (`${this.endpoint}/GetPopularTags`);
  }

  suggestTags(query: string): Observable<CommunityTag[]> {
    return this.payfactorsApiService.get<CommunityTag[]>
    (`${this.endpoint}/GetSuggestedTags`, {params: { query: query }} );
  }
}
