import {Component, Input, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserAssignedRole, RolePermission} from 'libs/models/security';

import * as userRoleReducer from '../../reducers';
import * as fromUserRoleViewActions from '../../actions/user-role-view.action';

@Component({
  selector: 'pf-user-role-function-tab',
  templateUrl: './user-role-function-tab.component.html',
  styleUrls: ['user-role-function-tab.component.scss']
})
export class UserRoleFunctionTabComponent implements OnDestroy {
  saveButtonText: string;
  rolePermissions: RolePermission[];
  currentRoleSubscription: Subscription;
  saveButtonTextSubscription: Subscription;
  currentRole: UserAssignedRole;
  constructor(public store: Store<userRoleReducer.State>) {
     this.saveButtonTextSubscription = this.store.select(userRoleReducer.getFunctionSaveButtonText).subscribe(text => {
      this.saveButtonText = text;
    });
    this.currentRoleSubscription = this.store.select(userRoleReducer.getCurrentUserRole).subscribe(userRole => {
      this.currentRole = userRole;
      if (userRole && userRole.Permissions) {
        this.rolePermissions = userRole.Permissions;
      }
    });
  }

  handleSaveClicked() {
    this.store.dispatch(new fromUserRoleViewActions.SaveCompanyRolePermissions( this.currentRole ));
  }
  handleCheckBoxCheck(currentPermission: any) {
    this.store.dispatch(new fromUserRoleViewActions.GrantDenyPermissions( currentPermission ));
  }
  ngOnDestroy() {
    this.currentRoleSubscription.unsubscribe();
    this.saveButtonTextSubscription.unsubscribe();
  }
}
