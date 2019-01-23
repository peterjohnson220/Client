import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UserAssignedRole } from 'libs/models/security';

import { UserRoleTabState } from '../../constants/user-role.constants';
import { UserRoleService } from '../../services';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleActions from '../../actions/user-role-view.action';
import * as fromUserRoleUserTabActions from '../../actions/user-role-users-tab.action';

@Component({
  selector: 'pf-user-role-page',
  templateUrl: './user-role.page.html',
  styleUrls: ['user-role.page.scss']
})
export class UserRolePageComponent implements OnDestroy {
  currentUserRoleTabState: UserRoleTabState = UserRoleTabState.FUNCTION;
  _UserRoleTabState: typeof UserRoleTabState = UserRoleTabState;
  currentTabStateSubscription: Subscription;
  currentRoleSubscription: Subscription;
  companyRolesSubscription: Subscription;
  currentRole: UserAssignedRole;
  userAssignedRoles: UserAssignedRole[];

  constructor(private userRoleService: UserRoleService, private store: Store<fromUserRoleViewReducer.State>) {
    this.store.dispatch(new fromUserRoleActions.LoadCompanyRoles());
    this.store.dispatch(new fromUserRoleUserTabActions.GetUsersAndRoles());
    this.companyRolesSubscription = this.store.select(fromUserRoleViewReducer.getCompanyRoles).subscribe(userRoles => {
      this.userAssignedRoles = userRoles;
    });

    this.currentTabStateSubscription = this.store.select(fromUserRoleViewReducer.getUserRoleCurrentTabState).subscribe(tabState => {
      this.currentUserRoleTabState = tabState;
    });

    this.currentRoleSubscription = this.store.select(fromUserRoleViewReducer.getCurrentUserRole).subscribe(userRole => {
      this.currentRole = userRole;
    });
  }

  handleTabClick(userRoleViewTabState: UserRoleTabState) {
    this.userRoleService.updateCurrentUserRoleViewTabState(userRoleViewTabState);
  }

  createUserRole() {
    this.store.dispatch(new fromUserRoleActions.OpenAddCompanyRoleModal());
  }

  clickRole(role: UserAssignedRole) {
    this.userRoleService.updateCurrentUserRole(role);
  }

  ngOnDestroy() {
    this.currentTabStateSubscription.unsubscribe();
    this.currentRoleSubscription.unsubscribe();
    this.companyRolesSubscription.unsubscribe();
  }
}
