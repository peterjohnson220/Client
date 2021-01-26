import { Injectable, OnDestroy } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Data, Router, RouterStateSnapshot} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { from, Observable, of, Subject, Subscription } from 'rxjs';
import {map, catchError, filter} from 'rxjs/operators';

import {PricingProjectApiService} from 'libs/data/payfactors-api/project';
import {UserContext} from 'libs/models/security';
import {PermissionService} from 'libs/core/services';

import * as fromPricingProjectPageActions from '../../_pricing-project/actions';
import * as fromPricingProjectPageReducer from '../../_pricing-project/reducers';
import * as fromRootState from 'libs/state/state';



@Injectable()
export class HasAccessToProjectGuard implements CanActivate {
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromPricingProjectPageReducer.State>,
    private pricingProjectApiService: PricingProjectApiService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService
  ) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
  }

  hasAccessToProject(projectId: number): Observable<boolean> {
    return this.pricingProjectApiService.getPricingProject(projectId).pipe(
      map((response) => {
        if (response) {
          this.store.dispatch(new fromPricingProjectPageActions.GetPricingProjectSuccess(response));
          return true;
        } else {
          this.router.navigate(['/not-found'], { relativeTo: this.route });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-found'], { relativeTo: this.route });
        return of(false);
      })
    );
  }

  hasAccessToPage(userContext, routeData) {
    if (userContext.AccessLevel === 'Admin') {
      return of(true);
    } else if (this.permissionService.CheckPermission(routeData.Permissions, routeData.Check)) {
      return of(true);
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userContext$.pipe(filter(uc => !!uc)).switchMap((uc, p) =>
      this.hasAccessToPage(uc, next.data) && this.hasAccessToProject(next.params.projectId || -1));
  }

}
