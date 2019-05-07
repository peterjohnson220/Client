import { Action } from '@ngrx/store';

import { UserAssignedRole } from 'libs/models/security/roles';
import { AddCompanyRoleForm } from 'libs/models/admin';

import { UserRoleTabState } from '../constants/user-role.constants';

export const UPDATE_USER_ROLE_TAB_STATE  = '[Company Admin/User Role] Update User Role Tab IUserRoleUsersTabState';
export const UPDATE_CURRENT_USER_ROLE  = '[Company Admin/User Role] Update Current User Role IUserRoleUsersTabState';
export const UPDATE_COMPANY_ROLES = '[Company Admin/User Role] Update Company Roles IUserRoleUsersTabState';
export const LOAD_COMPANY_ROLES = '[Company Admin/User Role] Load Company Roles IUserRoleUsersTabState';
export const LOAD_COMPANY_ROLES_ERROR = '[Company Admin/User Role] Load Company Roles Error IUserRoleUsersTabState';
export const ADD_COMPANY_ROLE = '[Company Admin/User Role] Add Company Role IUserRoleUsersTabState';
export const ADD_COMPANY_ROLE_ERROR = '[Company Admin/User Role] Add Company Role Error IUserRoleUsersTabState';
export const OPEN_ADD_COMPANY_ROLE_MODAL = '[Company Admin/User Role] Open Add Company Role Modal IUserRoleUsersTabState';
export const CLOSE_ADD_COMPANY_ROLE_MODAL = '[Company Admin/User Role] Close Add Company Role Modal IUserRoleUsersTabState';
export const FIELD_CHANGE = '[Company Admin/User Role] Field Change IUserRoleUsersTabState';
export const CANCEL_ALL_CHANGES = '[Company Admin/User Role] Cancel All Changes';
export const SAVE_ALL_CHANGES = '[Company Admin/User Role] Save All Changes';
export const SAVE_ROLE_SUCCESS = '[Company Admin/User Role] Save Role Success';
export const SAVE_ROLE_ERROR = '[Company Admin/User Role] Save Role Error';
export const DISABLE_SAVE_BUTTON = '[Company Admin/User Role] Disable Save Button';
export const EDIT_ROLE_NAME = '[Company Admin/User Role] Edit Role Name IUserRoleUsersTabState';
export const DISCARD_ROLE_CHANGES = '[Company Admin/User Role] Discard Role Changes';

export class FieldChange implements Action {
  readonly type = FIELD_CHANGE;
  constructor(public payload: AddCompanyRoleForm) {}
}

export class UpdateUserRoleTabState implements Action {
  readonly type = UPDATE_USER_ROLE_TAB_STATE;

  constructor(public payload: UserRoleTabState) { }
}

export class UpdateCurrentUserRole implements Action {
  readonly type = UPDATE_CURRENT_USER_ROLE;

  constructor(public payload: UserAssignedRole) { }
}

export class UpdateCompanyRoles implements Action {
  readonly type = UPDATE_COMPANY_ROLES;

  constructor(public payload: UserAssignedRole[]) { }
}

export class LoadCompanyRoles implements Action {
  readonly type = LOAD_COMPANY_ROLES;
  constructor() {}
}

export class LoadCompanyRolesError implements Action {
  readonly type = LOAD_COMPANY_ROLES_ERROR;
  constructor(public payload: string) {}
}

export class AddCompanyRole implements Action {
  readonly type = ADD_COMPANY_ROLE;
  constructor(public payload: UserAssignedRole) { }
}

export class AddCompanyRoleError implements Action {
  readonly type = ADD_COMPANY_ROLE_ERROR;
  constructor(public payload: any) { }
}

export class OpenAddCompanyRoleModal implements Action {
  readonly type = OPEN_ADD_COMPANY_ROLE_MODAL;
  constructor() {}
}

export class CloseAddCompanyRoleModal implements Action {
  readonly type = CLOSE_ADD_COMPANY_ROLE_MODAL;
  constructor() {}
}

export class SaveAllChanges implements Action {
  readonly type = SAVE_ALL_CHANGES;
  constructor(public payload: any) {}
}

export class CancelAllChanges implements Action {
  readonly type = CANCEL_ALL_CHANGES;
  constructor() {}
}

export class SaveRoleSuccess implements Action {
  readonly type = SAVE_ROLE_SUCCESS;
  constructor(public payload: string) {}
}

export class SaveRoleError implements Action {
  readonly type = SAVE_ROLE_ERROR;
  constructor(public payload: string) {}
}

export class DisableSaveButton implements Action {
  readonly type = DISABLE_SAVE_BUTTON;
  constructor() {}
}

export class EditRoleName implements  Action {
  readonly type = EDIT_ROLE_NAME;
  constructor(public payload: any) {}
}

export class DiscardRoleChanges implements  Action{
  readonly type = DISCARD_ROLE_CHANGES
  constructor() {}
}

export type Actions = FieldChange
  | UpdateUserRoleTabState
  | UpdateCurrentUserRole
  | UpdateCompanyRoles
  | LoadCompanyRoles
  | LoadCompanyRolesError
  | AddCompanyRole
  | AddCompanyRoleError
  | OpenAddCompanyRoleModal
  | CloseAddCompanyRoleModal
  | SaveAllChanges
  | CancelAllChanges
  | SaveRoleSuccess
  | SaveRoleError
  | DisableSaveButton
  | EditRoleName
  | DiscardRoleChanges;
