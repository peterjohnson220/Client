import { Injectable } from '@angular/core';

import { NavigationLink, SidebarLink } from '../../../models/navigation';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class PayMarketApiService {
  private endpoint = 'PayMarket';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  get(companyPayMarketId: number) {
    return this.payfactorsApiService
      .get<any>(`${this.endpoint}(${companyPayMarketId})`);
  }

}
