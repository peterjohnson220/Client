import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext, HomePageLink } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  payfactorsLogo = './assets/payfactors-transparent.png';

  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;
  @Input() homePageLink: HomePageLink;

  constructor() {}
}
