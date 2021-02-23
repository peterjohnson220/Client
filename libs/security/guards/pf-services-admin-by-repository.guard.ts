import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { take, filter, switchMap, map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import * as fromRootState from '../../state/state';
import * as fromSiteAdminRouteReducer from 'libs/features/site-admin/site-admin-route/reducers';
import * as fromSiteAdminRouteActions from 'libs/features/site-admin/site-admin-route/actions';
import { PRICING_LOADER_NEW } from 'libs/features/site-admin/site-admin-route/constants';
import { UserContext } from 'libs/models';

@Injectable()
export class PfServicesAdminByRepositoryGuard implements CanActivate {
  private unsubscribe$ = new Subject();
  userContext$: Observable<UserContext>;
  userContext: UserContext;
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router
  ) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.userContext$
      .pipe(
        filter(uc => !!uc),
        takeUntil(this.unsubscribe$)
      ).subscribe(userContext => {
      this.userContext = userContext;
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.waitForUserContextLoadAttempt().pipe(
      switchMap(() => {
            switch (next.routeConfig.path) {
              case 'pricing-loader': {
                return this.repositoriesValidation();
              }
              default: {
                return this.defaultValidation();
              }
            }
      })
    );
  }

  private waitForUserContextLoadAttempt() {
    return this.store.select(fromRootState.getGettingUserContextAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }

  private defaultValidation(): Observable<boolean> {
    if (this.userContext.AccessLevel === 'Admin' && this.userContext.CompanySystemUserGroupsId === 1) {
      return of(true);
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }
  private repositoriesValidation() {
    this.store.dispatch(new fromSiteAdminRouteActions.GetRepositoriesByRoute(PRICING_LOADER_NEW));
    return this.store.select(fromSiteAdminRouteReducer.getRepositoriesByRoute).pipe(filter(uc => !!uc)).
      map(rbr => {
        if (this.userContext.AccessLevel === 'Admin' && !(rbr.indexOf(this.userContext.CompanySystemUserGroupsId) === -1) ) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      });
  }
}
