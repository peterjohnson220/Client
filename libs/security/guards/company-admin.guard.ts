import {Injectable, OnDestroy} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';

import * as fromRootState from '../../state/state';

import { UserContext } from '../../models/security';
import { PermissionService } from '../../core/services';

@Injectable()
export class AuthorizationGuard implements CanActivate, OnDestroy {
  userContext: UserContext;
  userContextSubscription: Subscription;
  constructor(
    private store: Store<fromRootState.State>,
    private _PermissionsService: PermissionService
  ) {
    this.userContextSubscription = this.store.select(fromRootState.getUserContext).subscribe(uc => {
      this.userContext = uc;
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.userContext.AccessLevel === 'Admin') {
      return of(true);
    } else if (this._PermissionsService.CheckPermission(next.data.Permissions, next.data.Check)) {
      return of(true);
    } else {
      window.location.href = '/ng/404';
      return of(false);
    }
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
