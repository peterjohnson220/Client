import { Injectable } from '@angular/core';

import { NavigationLink, SidebarLink } from '../../../models/navigation';
import { AdminNavigationLinkResponse } from '../../../models/payfactors-api/navigation';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationApiService {
  private endpoint = 'Navigation';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getHeaderDropdownNavigationLinks() {
    return this.payfactorsApiService
      .get<NavigationLink[]>(`${this.endpoint}.GetHeaderDropdownNavigationLinks`);
  }

  getSsoHeaderDropdownNavigationLinks() {
    return this.payfactorsApiService
      .get<NavigationLink[]>(`${this.endpoint}.GetSsoHeaderDropdownNavigationLinks`);
  }

  getSideBarLinks() {
    return this.payfactorsApiService
      .get<SidebarLink[]>(`${this.endpoint}.GetSideBarLinks`);
  }

  getUserVoiceLink() {
    return this.payfactorsApiService
      .get<NavigationLink>(`${this.endpoint}.GetUserVoiceNavigationLink`);
  }

  getSiteAdminNavigationLinks() {
    return this.payfactorsApiService.get<AdminNavigationLinkResponse[]>(`${this.endpoint}.GetSiteAdminNavigationLinks`);
  }

  getCompanyAdminNavigationLinks() {
    return this.payfactorsApiService.get<AdminNavigationLinkResponse[]>(`${this.endpoint}.GetCompanyAdminNavigationLinks`);
  }
}
