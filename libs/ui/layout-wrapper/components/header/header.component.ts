import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext } from '../../../../models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  payfactorsLogo = 'https://f7021091349f6caaffd2-5b56effc7aa76a3323ddc3429496d092.ssl.cf5.rackcdn.com/company_logos/PayFactorsLogo_White.png';

  @Input() avatarSource: string;
  @Input() companyLogoSource: string;
  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;

  constructor() {}
}
