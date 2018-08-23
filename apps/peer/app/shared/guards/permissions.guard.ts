import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, map, take, switchMap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import * as fromPermissionAction from '../actions/permissions.actions';
import * as fromPermissionReducer from '../reducers';

@Injectable()
export class PeerPermissionsGuard implements CanActivate {
  permissionsLoaded: boolean;

  constructor(
    private store: Store<fromRootState.State>,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.store.select(fromRootState.getIsAdmin).pipe(
      switchMap(uc => {
        if (uc) {
          return of(true);
        }

        // otherwise check to see if we are a participant in this exchange
        this.store.dispatch(new fromPermissionAction.LoadAccessPermissions());

        return this.waitForPermissionsLoadAttempt().pipe(
          switchMap(() =>
            this.store.select(fromPermissionReducer.getExchangeAccess).pipe(
              map(ucon => {
                if (ucon.indexOf(+route.params.id) > -1) {
                  return true;
                } else {
                  this.router.navigate(['/access-denied']);
                  return false;
                }
              }
              )
            )
          )
        );
      }));
  }

  private waitForPermissionsLoadAttempt() {
    return this.store.select(fromPermissionReducer.getExchangeAccessLoadAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }
}
