import { Injectable } from '@angular/core';
import { UserContext } from '../../../models/security';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanySecurityApiService {
  private endpoint = 'CompanySecurity';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getIdentity() {
    return this.payfactorsApiService.get<UserContext>(`${this.endpoint}.GetIdentity`);
  }

}
