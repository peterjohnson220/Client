import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

@Injectable()
export class FeatureFlagGuard implements CanActivate {

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.featureFlagService.enabled(route.data.featureFlag.name, route.data.featureFlag.defaultValue)) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
