import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityCategory } from 'libs/models/community';

@Injectable({
  providedIn: 'root',
})
export class CommunityCategoriesApiService {
  private endpoint = 'CommunityCategories';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  get(): Observable<CommunityCategory[]> {
    return this.payfactorsApiService.get<CommunityCategory[]>
    (`${this.endpoint}/GetCategories`);
  }
}
