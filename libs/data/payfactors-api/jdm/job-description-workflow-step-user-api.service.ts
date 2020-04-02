import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class JobDescriptionWorkflowStepUserApiService {
  private endpoint = 'WorkflowStepUser';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  setWorkflowUserStepToIsBeingViewed(tokenId: string, value: boolean) {
    return this.payfactorsApiService.get(`${this.endpoint}/SetIsBeingViewedOnWorkflowUserStep`, {params: {jwt: tokenId, isBeingViewed: value}});
  }
}
