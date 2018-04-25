import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';

// TODO: Switch to lettable operators once ngrx updates
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import * as fromRootState from '../../state/state';

@Injectable()
export class PfAdminGuard implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.waitForUserContextLoadAttempt().switchMap(() => {
      return this.store.select(fromRootState.getUserContext).map(uc => {
        if (uc.AccessLevel === 'Admin') {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      });
    });
  }

  private waitForUserContextLoadAttempt() {
    return this.store.select(fromRootState.getGettingUserContextAttempted).filter(attempted => attempted).take(1);
  }
}
