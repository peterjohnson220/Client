import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { Subject } from 'rxjs';

@Injectable()
export class JobsHierarchyPageGuard implements CanActivate, OnDestroy {
  jobsHierarchyPageFeatureFlag: RealTimeFlag = {key: FeatureFlags.JobsHierarchyPage, value: false};
  unsubscribe$ = new Subject<void>();

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private router: Router
  ) {
    this.featureFlagService.bindEnabled(this.jobsHierarchyPageFeatureFlag, this.unsubscribe$);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jobsHierarchyPageFeatureFlag.value) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
