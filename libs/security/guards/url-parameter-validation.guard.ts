import {Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as fromRootState from '../../state/state';

import { UserContext } from '../../models/security';
import { PermissionService } from '../../core/services';

@Injectable()
export class UrlParameterValidationGuard implements CanActivate {
  userContext$: Observable<UserContext>;

  constructor(
    private router: Router,
    private store: Store<fromRootState.State>,
    private permissionService: PermissionService
  ) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userContext$.pipe(filter(uc => !!uc)).switchMap(uc => this.hasAccess(uc, next));
  }

  private hasAccess(userContext: UserContext, activeRoute: ActivatedRouteSnapshot, ): Observable<boolean> {
    const queryParam = activeRoute.queryParamMap;
    const routeData = activeRoute.data;
    if (activeRoute.routeConfig.path === 'pricing-loaders-download') {
      const hasCompanyId = queryParam.get('companyId') !== null && queryParam.get('companyId') !== '';
      if (userContext.AccessLevel === 'Admin' && hasCompanyId && queryParam.get('companyName') !== null) {
        return of(true);
      } else if (this.permissionService.CheckPermission(routeData.Permissions, routeData.Check) && queryParam.keys.length === 0) {
        return of(true);
      } else {
        this.router.navigate(['/access-denied']);
        return of(false);
      }
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }
}
