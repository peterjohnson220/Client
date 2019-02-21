import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take, filter, switchMap, map } from 'rxjs/operators';

import * as fromLayoutReducer from '../../ui/layout-wrapper/reducers';
import * as fromLeftSidebarActions from '../../ui/layout-wrapper/actions/left-sidebar.actions';
import { environment } from '../../../environments/environment';
import { AppToTileMapping } from '../app-to-tile-map';

@Injectable()
export class TileEnabledGuard implements CanActivate, OnDestroy {
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
        map(nl => {

          const paths = window.location.pathname.split('/');
          const hostPathIndex = paths.findIndex(p => p.toLowerCase() === environment.hostPath.toLowerCase());
          const appName = paths[hostPathIndex + 1].toLowerCase();
          const haveTile = nl.some(f => f.Name.toLowerCase() === AppToTileMapping[appName].tileName.toLowerCase());

          if (haveTile) {
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
