import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { AuthRedirectRequest } from '../../../models/dashboard';

@Injectable()
export class IntegrationApiService {
  private endpoint = 'Integration';

  constructor(private payfactorsApiService: PayfactorsApiService) {

  }

  authRedirect(request: AuthRedirectRequest) {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/AuthRedirect`, {
      params: {
        compositeDataLoadExternalId: request.Id,
        action: request.Action
      }
    });
  }
}
