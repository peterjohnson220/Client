import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';
import { CommunityTopic } from '../../../models/community';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityFilterApiService {
  private endpoint = 'CommunityFilters';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getIndustries(): Observable<CommunityIndustry[]> {
    return this.payfactorsApiService.get<CommunityIndustry[]>
    (`${this.endpoint}/GetIndustryFilterOptions`);
  }

  getCompanySizes(): Observable<CommunityCompanySize[]> {
    return this.payfactorsApiService.get<CommunityCompanySize[]>
    (`${this.endpoint}/GetCompanySizeFilterOptions`);
  }

  getTopics(): Observable<any> {
    return this.payfactorsApiService.get<CommunityTopic[]>
    (`${this.endpoint}/GetTopics`);
  }
}
