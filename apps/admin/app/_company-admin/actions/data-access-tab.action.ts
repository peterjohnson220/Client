import { Action } from '@ngrx/store';

import {RoleDataRestriction, UserAssignedRole, DataType} from 'libs/models/security/roles';

export const LOAD_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types';
export const LOADED_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types Complete';
export const UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS = '[UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS] Update Current Role Data Restrictions';
export const CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES = '[CANCEL_CHANGES] Cancel Role Data Restrictions Changes';
export const UPDATE_CURRENT_ROLE_DATA_ACCESS_TAB =  '[UPDATE_CURRENT_ROLE_DATA_ACCESS_TAB] Update current role Role Data Restrictions';
export const SET_DATA_RESTRICTIONS_UNCHANGED = '[SET_DATA_RESTRICTIONS_UNCHANGED] Set Data Restrictions Unchanged';

export class LoadDataTypes implements Action {
  readonly type = LOAD_DATA_TYPES;
  constructor() {}
}
export class LoadedDataTypes implements Action {
  readonly type = LOADED_DATA_TYPES;
  constructor(public payload: DataType[]) {}
}

export class UpdateCurrentRoleDataRestrictions implements Action {
  readonly type = UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS;
  constructor(public payload: RoleDataRestriction[]) {
  }
}
export class SetDataRestrictionsUnchanged implements Action {
  readonly type = SET_DATA_RESTRICTIONS_UNCHANGED;
  constructor(public payload: RoleDataRestriction[]) {
  }
}
export class UpdateCurrentRoleDataAccessTab implements Action {
  readonly type = UPDATE_CURRENT_ROLE_DATA_ACCESS_TAB;
  constructor(public payload: UserAssignedRole) {
  }
}
export class CancelRoleDataRestrictionChanges implements Action {
  readonly type = CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES;
  constructor() {  }
}

export type DataAccessTabAction = LoadDataTypes
  | LoadedDataTypes
  | UpdateCurrentRoleDataRestrictions
  | UpdateCurrentRoleDataAccessTab
  | CancelRoleDataRestrictionChanges
  | SetDataRestrictionsUnchanged;
