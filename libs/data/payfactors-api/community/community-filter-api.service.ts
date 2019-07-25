import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityCompanySizeBucket } from 'libs/models/community/community-company-size-bucket.model';

@Injectable()
export class CommunityFilterApiService {
  private endpoint = 'CommunityFilters';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getIndustries(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>
    (`${this.endpoint}/GetIndustryFilterOptions`);
  }

  getCompanySizes(): Observable<CommunityCompanySizeBucket[]> {
    return this.payfactorsApiService.get<CommunityCompanySizeBucket[]>
    (`${this.endpoint}/GetCompanySizeFilterOptions`);
  }
}
