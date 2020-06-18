import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import {take, filter, switchMap, map} from 'rxjs/operators';

import * as fromRootState from '../../state/state';

@Injectable()
export class PfServicesAdminOnlyGuard  implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.waitForUserContextLoadAttempt().pipe(
      switchMap(() => {
        return this.store.select(fromRootState.getUserContext).pipe(
          map(uc => {
            if (uc.AccessLevel === 'Admin' && uc.CompanySystemUserGroupsId === 1) {
              return true;
            } else {
              this.router.navigate(['/access-denied']);
              return false;
            }
          })
        );
      })
    );
  }

  private waitForUserContextLoadAttempt() {
    return this.store.select(fromRootState.getGettingUserContextAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }
}
