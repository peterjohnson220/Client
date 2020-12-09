import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

@Injectable()
export class GradeBasedRangeGroupGuard implements CanActivate, OnDestroy {
  gradeBasedRangeGroupLandingPageFlag: RealTimeFlag = {key: FeatureFlags.StructuresGradeBasedRangeLandingPage, value: false};
  unsubscribe$ = new Subject<void>();

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private router: Router
  ) {
    this.featureFlagService.bindEnabled(this.gradeBasedRangeGroupLandingPageFlag, this.unsubscribe$);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.gradeBasedRangeGroupLandingPageFlag.value) {
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
