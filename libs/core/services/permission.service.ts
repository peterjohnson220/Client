import {Injectable, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import {Subscription} from 'rxjs';

import * as fromRootState from '../../state/state';
import {UserContext} from '../../models/security';
import {PermissionCheckEnum} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements OnDestroy {
  private userContext: UserContext;
  private userContextSubscription: Subscription;
  constructor(private store: Store<fromRootState.State>) {
    this.userContextSubscription = this.store.select(fromRootState.getUserContext).subscribe(uc => {
      this.userContext = uc;
    });
  }

  public CheckPermission(permissions: string[], logic: PermissionCheckEnum): boolean {
    switch (logic) {
      case PermissionCheckEnum.Any:
        return this.HasAnyPermission(permissions);
      case PermissionCheckEnum.All:
        return this.HasAllPermissions(permissions);
      case PermissionCheckEnum.Single:
        return permissions.length > 0 ? this.HasPermission(permissions[0]) : false;
    }
  }

  private HasPermission(permission: string): boolean {
    return this.userContext.Permissions.indexOf(permission) > -1;
  }

  private HasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.userContext.Permissions.indexOf(p) > -1);
  }

  private HasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.userContext.Permissions.indexOf(p) > -1);
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
