import { Injectable } from '@angular/core';
import * as fromRootState from '../../state/state';
import {Store} from '@ngrx/store';

@Injectable()
export class PermissionService {
  constructor(private store: Store<fromRootState.State>) { }
  public  HasPermission(permission: string) {
        let HasPermission = false;
    this.store.select(fromRootState.getUserContext).subscribe(
      uc => {
        HasPermission = uc.SystemPermissions.some( s => s.Permission === permission) ; });
    return HasPermission;
  }
  public  HasAnyPermission(permissions: string[]) {
    let HasPermission = false;
    this.store.select(fromRootState.getUserContext).subscribe(
      uc => {
        HasPermission = uc.SystemPermissions.some( s =>  permissions.includes(s.Permission)) ; });
    return HasPermission;
  }
}
