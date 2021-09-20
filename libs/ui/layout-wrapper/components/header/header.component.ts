import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { NavigationLink, UserContext, HomePageLink } from 'libs/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';
import { SystemUserGroupNames } from 'libs/constants';

@Component({
  selector: 'pf-layout-wrapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  @Input() gettingDropDownNavigationLinks: boolean;
  @Input() gettingDropdownNavigationLinksError: boolean;

  @Input() dropdownNavigationLinks: NavigationLink[];
  @Input() userContext: UserContext;
  @Input() homePageLink: HomePageLink;
  @Input() requireSSOLogin: boolean;

  payscaleBrandingFeatureFlag: RealTimeFlag = { key: FeatureFlags.PayscaleBranding, value: false };
  unsubscribe$ = new Subject<void>();

  get showNotificationsBadge(): boolean {
    return !this.userContext.IsPublic || this.userContext.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness;
  }

  constructor(private featureFlagService: AbstractFeatureFlagService) {
    this.featureFlagService.bindEnabled(this.payscaleBrandingFeatureFlag, this.unsubscribe$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
