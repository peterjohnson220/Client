import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

// TODO: Switch to lettable operators once ngrx updates
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import * as fromAppState from '../../state/state';

@Injectable()
export class UserContextGuard implements CanActivate {
  constructor(
    private store: Store<fromAppState.AppState>
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Once we know there has been an attempt to get the context from the API we will ensure that we have a context
    // in the store before allowing the route to be activated.
    return this.waitForUserContextLoadAttempt().switchMap(() =>
       this.store.select(fromAppState.getUserContext).map(uc => !!uc).take(1)
    );
  }

  // This will not emit any values until a attempt to get the user context from the API has completed with either
  // a Success or Error.
  private waitForUserContextLoadAttempt() {
    return this.store.select(fromAppState.getGettingUserContextAttempted).filter(attempted => attempted).take(1);
  }
}
