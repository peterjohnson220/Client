import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CommunityIndustryApiService {
  private endpoint = 'CommunityFilters';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getIndustries(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>
    (`${this.endpoint}/GetIndustryFilterOptions`);
  }
}
