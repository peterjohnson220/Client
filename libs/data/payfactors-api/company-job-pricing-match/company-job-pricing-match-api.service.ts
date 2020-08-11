import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyJobPricingMatchApiService {
  private endpoint = 'CompanyJobPricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  updateExcludeFromParticipation(companyJobPricingMatchIds: number[], excludeFromParticipation: boolean) {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.UpdateExcludeFromParticipation`, {
      companyJobPricingMatchIds: companyJobPricingMatchIds,
      excludeFromParticipation: excludeFromParticipation
    });
  }
}
