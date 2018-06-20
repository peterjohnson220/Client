import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter, switchMap, map, take } from 'rxjs/operators';


import * as fromRootState from '../../state/state';

@Injectable()
export class UserContextGuard implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Once we know there has been an attempt to get the context from the API we will ensure that we have a context
    // in the store before allowing the route to be activated.
    return this.waitForUserContextLoadAttempt().pipe(
      switchMap(() =>
       this.store.select(fromRootState.getUserContext).pipe(
         map(uc => !!uc),
         take(1)
        )
      )
    );
  }

  // This will not emit any values until a attempt to get the user context from the API has completed with either
  // a Success or Error.
  private waitForUserContextLoadAttempt() {
    return this.store.select(fromRootState.getGettingUserContextAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }
}
