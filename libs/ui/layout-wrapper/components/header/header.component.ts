import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext } from '../../../../models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() avatarSource: string;
  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;

  constructor() {}
}
