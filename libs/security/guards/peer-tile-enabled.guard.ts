import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';

// TODO: Switch to lettable operators once ngrx updates
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import * as fromLayoutReducer from '../../ui/layout-wrapper/reducers';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as fromLeftSidebarActions from '../../ui/layout-wrapper/actions/left-sidebar.actions';
import * as fromRootState from '../../state/state';

@Injectable()
export class PeerTileEnabledGuard implements CanActivate, OnInit, OnDestroy {
  navigationLoadAttempted: boolean;
  navigationLoadAttempted$: Observable<boolean>;
  navigationLoadAttemptedSubscription: Subscription;
  constructor(
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>,
    private router: Router
  ) {
    this.navigationLoadAttempted$ = this.layoutStore.select(fromLayoutReducer.getLoadedLeftSidebarNavigationLinksError);
  }

  ngOnInit() {
    this.navigationLoadAttemptedSubscription = this.navigationLoadAttempted$.subscribe(attempted => {
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

    return this.waitForLeftSidebarLinks().switchMap(() => {
      return this.layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks).map(sl => {
        const peerLink = sl.filter(f => f.Name === 'Peer');
        if (peerLink.length === 1) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      });
    });
  }

  private waitForLeftSidebarLinks() {
    return this.layoutStore.select(fromLayoutReducer.getLoadedLeftSidebarNavigationLinksError)
      .filter(attempted => attempted).take(1);
  }
}
