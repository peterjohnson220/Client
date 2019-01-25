import { Action } from '@ngrx/store';

import { RolePermission, UserAssignedRole } from 'libs/models/security/roles';

export const UPDATE_CURRENT_ROLE_FUNCTION_TAB = '[Company Admin/User Role Function Tab] Get Company Role Permissions';
export const GRANT_DENY_PERMISSIONS = '[Company Admin/User Role Function Tab] Checkbox Clicked';
export const CANCEL_PERMISSION_CHANGES = '[Company Admin/User Role Function Tab] Cancel Permission Changes';

export class UpdateCurrentRoleFunctionTab implements Action {
  readonly type = UPDATE_CURRENT_ROLE_FUNCTION_TAB;
  constructor(public payload: UserAssignedRole) {}
}

export class GrantDenyPermissions implements Action {
  readonly type = GRANT_DENY_PERMISSIONS;
  constructor(public payload:  RolePermission) {}
}

export class CancelPermissionChanges implements Action {
  readonly type = CANCEL_PERMISSION_CHANGES;
  constructor() {}
}


export type FunctionTabActions = UpdateCurrentRoleFunctionTab
  | GrantDenyPermissions
  | CancelPermissionChanges;
