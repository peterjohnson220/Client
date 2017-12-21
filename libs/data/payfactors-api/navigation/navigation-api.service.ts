import { Injectable } from '@angular/core';

import { NavigationLink, SidebarLink } from '../../../models/navigation';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UserVoiceLink } from '../../../models/navigation/user-voice-link.model';

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
      .get<NavigationLink[]>(`${this.endpoint}.GetSideBarLinks`);
  }

  getUserVoiceLink() {
    return this.payfactorsApiService
      .get<NavigationLink>(`${this.endpoint}.GetUserVoiceNavigationLink`);
  }

}
