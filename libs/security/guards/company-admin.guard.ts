import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import {take, filter, switchMap, map} from 'rxjs/operators';

import * as fromRootState from '../../state/state';

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.waitForUserAssignedRoleLoadAttempt().pipe(
      switchMap(() => {
        return this.store.select(fromRootState.getUserAssignedRoles).pipe(
          map(uar => {
            if (uar.find(r => r.RoleName === 'Company Admin').Assigned) {
              return true;
            } else {
              window.location.href = '/ng/404';
              return false;
            }
          }),
          take(1)
        );
      })
    );
  }

  private waitForUserAssignedRoleLoadAttempt() {
    return this.store.select(fromRootState.getUserAssignedRolesAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }
}
