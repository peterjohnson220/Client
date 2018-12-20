import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserAndRoleModel, UserAssignedRole} from 'libs/models/security';

import {UserRoleTabState} from '../../constants/user-role.constants';
import * as fromUserRoleViewReducer from '../../reducers';

@Component({
  selector: 'pf-user-role-users-tab',
  templateUrl: './user-role-users-tab.component.html',
  styleUrls: ['user-role-users-tab.component.scss']
})
export class UserRoleUsersTabComponent implements OnDestroy {
  usersAndRolesSubscription: Subscription;
  usersAndRoles: UserAndRoleModel[];
  usersInSelectedRole: UserAndRoleModel[];
  usersNotInRole: UserAndRoleModel[];
  currentRoleSubscription: Subscription;
  currentRole: UserAssignedRole;
  currentUserRoleTabState: UserRoleTabState;
  currentTabStateSubscription: Subscription;
  _UserRoleTabState: typeof UserRoleTabState = UserRoleTabState;

  constructor(private store: Store<fromUserRoleViewReducer.State>) {
    this.currentRoleSubscription = this.store.select(fromUserRoleViewReducer.getCurrentUserRole).subscribe(userRole => {
      this.currentRole = userRole;
      if (this.usersAndRoles) {
        this.usersInSelectedRole = this.usersAndRoles.filter(u => {
          return u.BelongsToRole === true && u.RoleId === this.currentRole.DerivedId && u.RoleType === this.currentRole.RoleType;
        });
        this.usersNotInRole = this.usersAndRoles.filter(u => {
          // TODO: Come up with more explicit logic for Standard User.
          // RoleType = S, RoleId = 2 is the current identifier, but it doesn't read cleanly
          return u.BelongsToRole === false || (u.BelongsToRole === true && u.RoleId === 2 && u.RoleType === 'S');
        });
      }
    });

    this.usersAndRolesSubscription = this.store.select(fromUserRoleViewReducer.getUsersAndRoles).subscribe(uar => {
        this.usersAndRoles = uar;
      }
    );

    this.currentTabStateSubscription = this.store.select(fromUserRoleViewReducer.getUserRoleCurrentTabState).subscribe(tabState => {
      this.currentUserRoleTabState = tabState;
    });
  }

  ngOnDestroy() {
    this.usersAndRolesSubscription.unsubscribe();
    this.currentRoleSubscription.unsubscribe();
    this.currentTabStateSubscription.unsubscribe();
  }
}
