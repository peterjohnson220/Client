import { Action } from '@ngrx/store';

import {CompanyRolePermission, UserAssignedRole} from 'libs/models/security';
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
export const GET_COMPANY_ROLE_PERMISSIONS = '[Company Admin/Company Role Permissions] Get Company Role Permissions';
export const UPDATE_COMPANY_ROLE_PERMISSIONS = '[Company Admin/Company Role Permissions] Update Company Role Permissions';
export const SET_COMPANY_ROLE_PERMISSIONS = '[Company Admin/Company Role Permissions] Set Company Role Permissions from API';
export const SET_FUNCTION_TAB_SAVE_BUTTON_TEXT = '[Company Admin/Company Role Permissions] Set Company Role Permissions from API';

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

export class SetFunctionTabSaveButtonText implements Action {
  readonly type = SET_FUNCTION_TAB_SAVE_BUTTON_TEXT;
  constructor(public payload: string) {}
}

export class CloseAddCompanyRoleModal implements Action {
  readonly type = CLOSE_ADD_COMPANY_ROLE_MODAL;
  constructor() {}
}
export class GetCompanyRolePermissions implements Action {
  readonly type = GET_COMPANY_ROLE_PERMISSIONS;
  constructor(public payload:  CompanyRolePermission[]) {}
}
export class UpdateCompanyRolePermissions implements Action {
  readonly type = UPDATE_COMPANY_ROLE_PERMISSIONS;
  constructor(public payload: UserAssignedRole) {}
}

export class SetCompanyRolePermissions implements Action {
  readonly type = SET_COMPANY_ROLE_PERMISSIONS;
  constructor(public payload: CompanyRolePermission[]) {}
}

export type Actions = UpdateUserRoleTabState
  | UpdateCurrentUserRole
  | UpdateCompanyRoles
  | LoadCompanyRoles
  | LoadCompanyRolesError
  | AddCompanyRole
  | AddCompanyRoleError
  | OpenAddCompanyRoleModal
  | CloseAddCompanyRoleModal
  | FieldChange
  | GetCompanyRolePermissions
  | SetCompanyRolePermissions
  | UpdateCompanyRolePermissions
  | SetFunctionTabSaveButtonText;
