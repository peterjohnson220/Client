import { Injectable } from '@angular/core';

import { UserContext } from '../../../models/security';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanySecurityApiService {

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getIdentity() {
    return this.payfactorsApiService.get<UserContext>('CompanySecurity.GetIdentity');
  }

}
