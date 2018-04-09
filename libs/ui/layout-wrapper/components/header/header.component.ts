import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext, HomePageLink } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  payfactorsLogo = './assets/payfactors-transparent.png';
  hcsLogo = './assets/hcs_powered_by_payfactors.png';

  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;
  @Input() homePageLink: HomePageLink;

  constructor() {}

  getHeaderLogo(systemUserGroupName: string) {
      if (systemUserGroupName === 'HealthcareSource') {
        return this.hcsLogo;
      }
      return this.payfactorsLogo;
  }
}
