import { Injectable } from '@angular/core';

import { NavigationLink } from '../../../models/navigation';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class NavigationApiService {
  private endpoint = 'Navigation';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getHeaderDropdownNavigationLinks() {
    return this.payfactorsApiService
      .get<NavigationLink[]>(`${this.endpoint}.GetHeaderDropdownNavigationLinks`);
  }

}
