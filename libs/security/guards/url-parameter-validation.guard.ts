import {Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, ParamMap, Data
} from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import * as fromRootState from '../../state/state';

import { UserContext } from '../../models/security';
import { PermissionService } from '../../core/services';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import * as fromCompanySelectorReducer from 'libs/features/company/company-selector/reducers';

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
    return this.userContext$.pipe(filter(uc => !!uc)).pipe(switchMap(uc => this.hasAccess(uc, next)));
  }

  private hasAccess(userContext: UserContext, activeRoute: ActivatedRouteSnapshot ): Observable<boolean> {
    switch (activeRoute.routeConfig.path) {
      case 'pricing-loaders-download': {
        return this.pricingLoadersDownloadValidation(userContext, activeRoute);
      }
      default: {
        this.router.navigate(['/access-denied']);
        return of(false);
      }
    }
  }

  private pricingLoadersDownloadValidation(userContext: UserContext, activeRoute: ActivatedRouteSnapshot) {
    const queryParam = activeRoute.queryParamMap;
    const routeData = activeRoute.data;
    const hasCompanyId = queryParam.get('companyId') !== null && queryParam.get('companyId') !== '';
    if (userContext.AccessLevel === 'Admin' && hasCompanyId && queryParam.get('companyName') !== null) {
      this.store.dispatch(new fromCompanySelectorActions.IsValidCompanyRepository(parseInt(queryParam.get('companyId'), 10)));
      return this.store.select(fromCompanySelectorReducer.isValidCompanyRepository).pipe(filter(cr => cr !== null)).pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      }));
    } else if (this.permissionService.CheckPermission(routeData.Permissions, routeData.Check) && queryParam.keys.length === 0) {
      return of(true);
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }
}
