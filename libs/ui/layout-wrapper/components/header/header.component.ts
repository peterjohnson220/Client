import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext } from '../../../../models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  payfactorsLogo = './assets/images/PayFactors-logo-onBlue-RGB_0313.png';

  @Input() avatarSource: string;
  @Input() companyLogoSource: string;
  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;

  constructor() {}
}
