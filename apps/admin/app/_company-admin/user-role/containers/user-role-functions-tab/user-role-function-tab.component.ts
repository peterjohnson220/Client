import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { SystemPermission } from 'libs/models/security';

import * as userRoleReducer from '../../reducers';
import * as fromUserRoleFunctionTabActions from '../../actions/user-role-functions-tab.action';

@Component({
  selector: 'pf-user-role-function-tab',
  templateUrl: './user-role-function-tab.component.html',
  styleUrls: ['user-role-function-tab.component.scss']
})
export class UserRoleFunctionTabComponent implements OnDestroy {
  systemPermissions: SystemPermission[];
  systemPermissionSubscription: Subscription;
  disableCheckboxes: boolean;
  disableCheckboxesSubscription: Subscription;
  constructor(public store: Store<userRoleReducer.State>) {
    this.systemPermissionSubscription = this.store.select(userRoleReducer.getFunctionTabPermissions).subscribe(p => {
      this.systemPermissions = p;
    });

    this.disableCheckboxesSubscription = this.store.select(userRoleReducer.getCheckboxesDisabled).subscribe(cb => {
      this.disableCheckboxes = cb;
    });
  }

  handleCheckBoxCheck(currentPermission: any) {
    this.store.dispatch(new fromUserRoleFunctionTabActions.GrantDenyPermissions(currentPermission));
  }

  ngOnDestroy() {
    this.systemPermissionSubscription.unsubscribe();
    this.disableCheckboxesSubscription.unsubscribe();
  }
}
