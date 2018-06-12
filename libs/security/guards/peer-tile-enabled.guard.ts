import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take, filter, switchMap, map } from 'rxjs/operators';

import * as fromLayoutReducer from '../../ui/layout-wrapper/reducers';
import * as fromLeftSidebarActions from '../../ui/layout-wrapper/actions/left-sidebar.actions';

@Injectable()
export class PeerTileEnabledGuard implements CanActivate, OnDestroy {
  navigationLoadAttempted: boolean;
  navigationLoadAttemptedSubscription: Subscription;

  constructor(
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>,
    private router: Router
  ) {
    this.navigationLoadAttemptedSubscription = this.layoutStore
      .select(fromLayoutReducer.getLoadedLeftSidebarNavigationLinks)
      .subscribe(attempted => {
        this.navigationLoadAttempted = attempted;
      });
  }

  ngOnDestroy() {
    this.navigationLoadAttemptedSubscription.unsubscribe();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.navigationLoadAttempted) {
      this.layoutStore.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
    }

    return this.waitForLeftSidebarLinks().pipe(switchMap(() => {
      return this.layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks).pipe(
        map(sl => {
          const peerLink = sl.filter(f => f.Name === 'Peer');
          if (peerLink.length === 1) {
            return true;
          } else {
            this.router.navigate(['/access-denied']);
            return false;
          }
        })
      );
    }));
  }

  private waitForLeftSidebarLinks() {
    return this.layoutStore.select(fromLayoutReducer.getLoadedLeftSidebarNavigationLinks).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }
}
