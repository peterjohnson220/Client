import { Action } from '@ngrx/store';

import { UserRoleTabState } from '../constants/user-role.constants';

export const UPDATE_USER_ROLE_TAB_STATE  = '[Company Admin/User Role] Update User Role Tab IUserRoleState';

export class UpdateUserRoleTabState implements Action {
  readonly type = UPDATE_USER_ROLE_TAB_STATE;

  constructor(public payload: UserRoleTabState) { }
}

export type Actions = UpdateUserRoleTabState;
