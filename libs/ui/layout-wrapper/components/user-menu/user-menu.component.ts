import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NavigationLink, UserContext } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnChanges {

  @Input() userContext: UserContext;
  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() requireSSOLogin: boolean;

  dropdownNavigationLinksWithDivider = ['Log Out', 'Referrals'];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dropdownNavigationLinks && !!changes.dropdownNavigationLinks.currentValue) {
      const submitATicketLink = this.dropdownNavigationLinks.find(x => x.Name === 'Submit a Ticket');
      if (submitATicketLink) {
        this.dropdownNavigationLinksWithDivider.push(submitATicketLink.Name);
        return;
      }
      const resourceLink = this.dropdownNavigationLinks.find(x => x.Name === 'Resources');
      if (resourceLink) {
        this.dropdownNavigationLinksWithDivider.push(resourceLink.Name);
        return;
      }
    }
  }

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
