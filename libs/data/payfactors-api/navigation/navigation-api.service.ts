import { Injectable } from '@angular/core';

import { NavigationLink, SidebarLink, UserVoiceLink } from '../../../models/navigation';

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

  getSideBarLinks() {
    return this.payfactorsApiService
      .get<SidebarLink[]>(`${this.endpoint}.GetSideBarLinks`);
  }

  getUserVoiceLink() {
    return this.payfactorsApiService
      .get<UserVoiceLink>(`${this.endpoint}.GetUserVoiceNavigationLink`);
  }

}
