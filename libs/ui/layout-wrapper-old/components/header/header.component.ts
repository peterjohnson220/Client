import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { NavigationLink, UserContext } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  avatarSource: string = environment.avatarSource;
  companyLogoSource: string = environment.companyLogoSource;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;

  constructor() {}
}
