import { Component, Input } from '@angular/core';

import { NavigationLink, UserContext } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  @Input() userContext: UserContext;
  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() requireSSOLogin: boolean;

  constructor() { }

}
