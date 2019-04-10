import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UserAssignedRole } from 'libs/models/security';

import { UserRoleTabState, RoleApiResponse } from '../../../constants/user-role.constants';
import { UserRoleService } from '../../../services';
import * as fromUserRoleViewReducer from '../../../reducers';
import * as fromUserRoleActions from '../../../actions/user-role-view.action';
import * as fromUserRoleUserTabActions from '../../../actions/user-role-users-tab.action';

@Component({
  selector: 'pf-user-role-page',
  templateUrl: './user-role.page.html',
  styleUrls: ['user-role.page.scss']
})
export class UserRolePageComponent implements OnDestroy {
  currentUserRoleTabState: UserRoleTabState = UserRoleTabState.FUNCTION;
  _UserRoleTabState: typeof UserRoleTabState = UserRoleTabState;
  _RoleApiResponse: typeof RoleApiResponse = RoleApiResponse;
  currentTabStateSubscription: Subscription;
  currentRoleSubscription: Subscription;
  companyRolesSubscription: Subscription;
  currentRole: UserAssignedRole;
  userAssignedRoles: UserAssignedRole[];
  usersTabPendingChangesSubscription: Subscription;
  usersTabPendingChanges: boolean;
  functionTabPendingChangesSubscription: Subscription;
  functionTabPendingChanges: boolean;
  userIdsToAssignSubscription: Subscription;
  userIdsToAssignToRole: number[];
  roleApiResponseSubscription: Subscription;
  roleApiResponse: string;
  saveButtonDisabledSubscription: Subscription;
  saveButtonDisabled: boolean;
  permissionIdsToSave: number[];
  permissionIdsToSaveSubscription: Subscription;

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

    this.saveButtonDisabledSubscription = this.store.select(fromUserRoleViewReducer.getSaveButtonDisabled).subscribe(sb => {
      this.saveButtonDisabled = sb;
    });

    this.usersTabPendingChangesSubscription = this.store.select(fromUserRoleViewReducer.getUsersTabHasPendingChanges).subscribe(ut => {
      this.usersTabPendingChanges = ut;
    });

    this.functionTabPendingChangesSubscription = this.store.select(fromUserRoleViewReducer.getFunctionTabPendingChanges).subscribe(ft => {
      this.functionTabPendingChanges = ft;
    });

    this.userIdsToAssignSubscription = this.store.select(fromUserRoleViewReducer.getUserIdsToSave).subscribe(id => {
      this.userIdsToAssignToRole = id;
    });

    this.roleApiResponseSubscription = this.store.select(fromUserRoleViewReducer.getRoleApiResponse).subscribe(api => {
      this.roleApiResponse = api;
    });

    this.permissionIdsToSaveSubscription = this.store.select(fromUserRoleViewReducer.getCurrentCheckedPermissionIds).subscribe(p => {
      this.permissionIdsToSave = p;
    });
  }

  handleTabClick(userRoleViewTabState: UserRoleTabState) {
    this.store.dispatch(new fromUserRoleActions.UpdateUserRoleTabState(userRoleViewTabState));
  }

  createUserRole() {
    this.store.dispatch(new fromUserRoleActions.OpenAddCompanyRoleModal());
  }

  clickRole(role: UserAssignedRole) {
    if (this.promptUserToSave(role)) {
      this.userRoleService.updateCurrentUserRole(role);
    }
  }

  saveChanges(): void {
    this.store.dispatch(new fromUserRoleActions.DisableSaveButton());

    const savePayload = {
      PermissionIdsToSave: this.permissionIdsToSave,
      UserIdsToAssign: this.userIdsToAssignToRole,
      CurrentRole: this.currentRole
    };

    this.store.dispatch(new fromUserRoleActions.SaveAllChanges(savePayload));
  }

  cancelChanges(): void {
    this.store.dispatch(new fromUserRoleActions.CancelAllChanges());
  }

  ngOnDestroy() {
    this.currentTabStateSubscription.unsubscribe();
    this.currentRoleSubscription.unsubscribe();
    this.companyRolesSubscription.unsubscribe();
    this.usersTabPendingChangesSubscription.unsubscribe();
    this.functionTabPendingChangesSubscription.unsubscribe();
    this.userIdsToAssignSubscription.unsubscribe();
    this.roleApiResponseSubscription.unsubscribe();
    this.saveButtonDisabledSubscription.unsubscribe();
    this.permissionIdsToSaveSubscription.unsubscribe();
  }

  promptUserToSave(input: any): boolean {
    if (!this.currentRole) {
      return true;
    }

    const stateIsModified = this.functionTabPendingChanges || this.usersTabPendingChanges;

    if (input === this.currentRole) {
      return false;
    }

    if (stateIsModified) {
      return confirm('All unsaved changes will be lost. Are you sure you wish to continue?');
    } else {
      return true;
    }
  }
}
