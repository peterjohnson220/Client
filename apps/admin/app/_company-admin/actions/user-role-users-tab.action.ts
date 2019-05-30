import { Action } from '@ngrx/store';

import { UserAssignedRole, UserAndRoleModel } from 'libs/models/security';

export const UPDATE_CURRENT_USER_ROLE_USER_TAB  = '[Company Admin/User Role User Tab] Update Current User Role IUserRoleUsersTabState';
export const GET_USERS_AND_ROLES = '[Company Admin/User Role User Tab] Get Users And Roles';
export const GET_USERS_AND_ROLES_SUCCESS = '[Company Admin/User Role User Tab] Get Users And Roles Success';
export const ADD_USER_TO_ROLE = '[Company Admin/User Role User Tab] Add User To Role';
export const FILTER_USERS_COLLECTION = '[Company Admin/User Role User Tab] Filter Users Collection';
export const CANCEL_CHANGES = '[Company Admin/User Role User Tab] Cancel Changes';
export const SET_USERS_TAB_SAVE_BUTTON_TEXT = '[Company Admin/User Role User Tab] Set Save Button Text';
export const SAVE_CHANGES = '[Company Admin/User Role User Tab] Save Changes';

export class UpdateUserTabCurrentUserRole implements Action {
  readonly type = UPDATE_CURRENT_USER_ROLE_USER_TAB;
  constructor(public payload: UserAssignedRole) { }
}

export class GetUsersAndRoles implements Action {
  readonly type = GET_USERS_AND_ROLES;
  constructor() {}
}

export class GetUsersAndRolesSuccess implements Action {
  readonly type = GET_USERS_AND_ROLES_SUCCESS;
  constructor(public payload: UserAndRoleModel[]) {}
}

export class AddUserToRole implements Action {
  readonly type = ADD_USER_TO_ROLE;
  constructor(public payload: UserAndRoleModel) {}
}

export class FilterUsersCollection implements Action {
  readonly type = FILTER_USERS_COLLECTION;
  constructor(public payload: string) {}
}

export class CancelChanges implements Action {
  readonly type = CANCEL_CHANGES;
  constructor() {}
}

export class SetUsersTabSaveButtonText implements Action {
  readonly type = SET_USERS_TAB_SAVE_BUTTON_TEXT;
  constructor(public payload: string) {}
}

export class SaveChanges implements Action {
  readonly type = SAVE_CHANGES;
  constructor(public payload: any) {}
}

export type UserTabActions = UpdateUserTabCurrentUserRole
  | GetUsersAndRoles
  | GetUsersAndRolesSuccess
  | AddUserToRole
  | FilterUsersCollection
  | CancelChanges
  | SetUsersTabSaveButtonText
  | SaveChanges;
