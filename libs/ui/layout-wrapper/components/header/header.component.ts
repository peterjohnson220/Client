import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NavigationLink, UserContext, HomePageLink } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;
  @Input() homePageLink: HomePageLink;
  @Input() enableCoreJdmInClient: boolean;
  @Input() requireSSOLogin: boolean;
  @Input() enableUserNotifications: boolean;

  homePageUrl: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.homePageLink && changes.homePageLink.currentValue) {
      const url: string = changes.homePageLink.currentValue.Url;
      if (url
          && url.toLowerCase() === '/ng/job-description-management/job-descriptions'
          && this.enableCoreJdmInClient === true) {
        this.homePageUrl = '/client/job-description-management/job-descriptions';
      } else {
        this.homePageUrl = url;
      }
    }
  }
}
