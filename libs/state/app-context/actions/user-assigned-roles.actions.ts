import { Action } from '@ngrx/store';

import { UserAssignedRole } from '../../../models/security/index';

export const GET_USER_ASSIGNED_ROLES = '[Security] Loading User Assigned Roles';
export const GET_USER_ASSIGNED_ROLES_SUCCESS = '[Security] Loading User Assigned Roles Success';
export const GET_USER_ASSIGNED_ROLES_ERROR = '[Security] Loading User Assigned Roles Error';

export class GetUserAssignedRoles implements Action {
  readonly type = GET_USER_ASSIGNED_ROLES;
  constructor () {}
}

export class GetUserAssignedRolesSuccess implements Action {
  readonly type = GET_USER_ASSIGNED_ROLES_SUCCESS;
  constructor (public payload: UserAssignedRole[]) {}
}

export class GetUserAssignedRolesError implements Action {
  readonly type = GET_USER_ASSIGNED_ROLES_ERROR;
  constructor (public payload: any) {}
}

export type Actions = GetUserAssignedRoles | GetUserAssignedRolesSuccess | GetUserAssignedRolesError;
