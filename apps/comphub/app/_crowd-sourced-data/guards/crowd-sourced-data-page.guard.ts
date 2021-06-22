import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';


@Injectable()
export class CrowdSourcedDataPageGuard implements CanActivate, OnDestroy {
  quickPriceCrowdSourcedDataPageFlag: RealTimeFlag = { key: FeatureFlags.QuickPriceCrowdSourcedDataPage, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private router: Router,
  ) {
    this.featureFlagService.bindEnabled(this.quickPriceCrowdSourcedDataPageFlag, this.unsubscribe$);
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.quickPriceCrowdSourcedDataPageFlag.value) {
      this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
