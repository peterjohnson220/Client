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

  dropdownNavigationLinksWithDivider = ['Log Out', 'Referrals', 'Submit a Ticket'];
  constructor() { }

  showUserDropdownMenu() {
      if (!this.userContext.IsPublic && !this.userContext.WorkflowStepInfo) {
        return true;
      } else if (this.requireSSOLogin && (!!this.userContext.WorkflowStepInfo || this.userContext.EmployeeAcknowledgementInfo)) {
        return true;
      } else {
        return false;
      }
  }

  requiresDivider(dropDownLinkName: string): boolean {
    return this.dropdownNavigationLinksWithDivider.indexOf(dropDownLinkName) > -1;
  }
}
