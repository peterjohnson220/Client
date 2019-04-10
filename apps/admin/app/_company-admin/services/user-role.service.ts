import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { UserAssignedRole } from 'libs/models/security';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';

import * as fromUserRoleViewReducer from '../reducers';
import * as fromUserRoleViewActions from '../actions/user-role-view.action';
import {UserRoleTabState} from '../constants/user-role.constants';

@Injectable()
export class UserRoleService {
  constructor(private store: Store<fromUserRoleViewReducer.State>,  private adminRolesApi: RolesApiService) {
  }

  updateCurrentUserRoleViewTabState(userRoleViewTabState: UserRoleTabState) {
    this.store.dispatch(new fromUserRoleViewActions.UpdateUserRoleTabState(userRoleViewTabState));
  }

  updateCurrentUserRole(userRole: UserAssignedRole) {
    this.store.dispatch(new fromUserRoleViewActions.UpdateCurrentUserRole(userRole));
  }

  updateCurrentRoleName(newRoleName: string, roleId: number) {
    return this.adminRolesApi.updateRoleName(newRoleName, roleId);
  }
}
